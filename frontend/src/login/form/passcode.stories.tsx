import { ComponentStory } from '@storybook/react';

import { PasscodeForm } from './passcode';

export default {
  title: 'KiwiTalk/login/PasscodeForm',
  component: PasscodeForm,
  argTypes: {
    onSubmit: { action: 'Passcode' },
  },
};

const Template: ComponentStory<typeof PasscodeForm> = (args) =>
  <PasscodeForm
    passcode={args.passcode}
    onSubmit={args.onSubmit}
  />;

export const Default = Template.bind({});
Default.args = {};

export const PreFilled = Template.bind({});
PreFilled.args = {
  passcode: '1234',
};