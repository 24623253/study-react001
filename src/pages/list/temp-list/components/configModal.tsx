import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type FormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<TableListItem>;
};

const configModal: React.FC<FormProps> = (props) => {
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      onFinish={props.onSubmit}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={660}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            title="规则配置"
            open={props.visible}
            destroyOnClose
            footer={submitter}
            onCancel={() => props.onCancel()}
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm
        name="step1"
        initialValues={{
          name: props.values.name,
          desc: props.values.name,
        }}
      >
        <ProFormText
          name="name"
          label="规则名称"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入规则名称！',
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label="规则描述"
          placeholder="请输入至少五个字符"
          rules={[
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="step2"
        initialValues={{
          target: '0',
          template: '0',
        }}
        title="配置规则属性"
      >
        <ProFormSelect
          name="template"
          width="md"
          label="规则模板"
          valueEnum={{
            0: '规则模板一',
            1: '规则模板二',
          }}
        />
        <ProFormRadio.Group
          name="type"
          label="规则类型"
          options={[
            {
              value: '0',
              label: '强',
            },
            {
              value: '1',
              label: '弱',
            },
          ]}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default configModal;
