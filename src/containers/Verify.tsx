import React, {useState} from 'react';
import VerifyCode from "../components/VerifyCode/VerifyCode";
import styled from 'styled-components';
import {Redirect} from 'react-router-dom';
import {ClientChatUser, TalkClient} from "node-kakao/dist";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(119.36deg, #FFFFFF 0%, #FFFFFF 0.01%, #FFFAE0 100%);
`;

const resultText: { [key: string]: string } = {
  success: '로그인 성공',
  passcode: '인증번호 필요',
  anotherdevice: '다른 기기에서 이미 로그인됨',
  restricted: '제한된 계정입니다.',
  wrong: '아이디 또는 비밀번호가 올바르지 않습니다.',
};

interface LoginResponse {
    result: string
    errorCode?: number
}

interface PasscodeResponse {
    result: string
    error?: string
}

// @ts-ignore
const talkClient: TalkClient = global.talkClient;
const nodeKakao = require('node-kakao');

const Verify = () => {
    const [redirect, setRedirect] = useState('');
    const onSubmit = (passcode: string) => {
        talkClient.once('login', (user: ClientChatUser) => {
            alert(user.Nickname + ' 로그인 성공');
            setRedirect('chat');
        });

        // @ts-ignore
        global.getUUID()
            .then((uuid: string) => {
                // @ts-ignore
                global.getClientName()
                    .then((clientName: string) => {
                        // @ts-ignore
                        nodeKakao.KakaoAPI.registerDevice(passcode, global.email, global.password, uuid, clientName)
                            .then(() => {
                                alert('인증 성공');
                                talkClient.emit('login');
                            })
                            .catch((reason: any) => {
                                switch (reason) {
                                    case -112: // 입력불가
                                        alert('인증 불가. 24시간 후에 재시도하십시오.');
                                        break;
                                    case -111: // 틀림
                                        alert(`인증번호가 틀렸습니다.`);
                                        break;
                                    default:
                                        alert(`알 수 없는 에러가 발생했습니다. 에러: ${reason}`);
                                        break;
                                }
                            });
                    });
            });
    };

  return redirect ? <Redirect to={redirect}/> :  (
    <Wrapper>
      <VerifyCode onSubmit={onSubmit}/>
    </Wrapper>
  )
};

export default Verify;