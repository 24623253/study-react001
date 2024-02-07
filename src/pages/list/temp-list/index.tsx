import React, { useState, useRef } from 'react';
import { Button, message, Input, Drawer } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import type { TableListItem, TableListPagination } from './data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { tempApi } from './service';
import { addRule, updateRule } from '../table-list/service';
import type { ProFormInstance } from '@ant-design/pro-components';
import ConfigModal from './components/configModal';
import type { FormValueType } from './components/configModal';

// 新建
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    hide();
    await addRule({ ...fields });
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

// 配置提交
const handleConfigSubmit = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在配置');
  console.log(fields, currentRow, '<<<<');
  try {
    hide();
    await updateRule({
      ...currentRow,
      ...fields,
    });
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [configModalVisible, handleConfigModalVisible] = useState<boolean>(false);

  const modalFormRef = useRef<ProFormInstance>();
  // const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 表格列数据
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '地址',
      dataIndex: 'name',
      tip: '这是一个提示',
      render: (dom, entity) => {
        return (
          <Button
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </Button>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val}万`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '上次调度时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleConfigModalVisible(true);
          }}
        >
          配置
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          跳转
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="临时测试列表"
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        request={tempApi}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      {/* 点击查看详情的抽屉 */}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow.name}
            request={async () => ({
              data: currentRow || {},
            })}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
      {/* 新建窗口的弹窗 */}
      <ModalForm
        title="新建"
        width="400px"
        formRef={modalFormRef}
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        submitter={{
          searchConfig: {
            resetText: '重置1',
          },
          resetButtonProps: {
            onClick: () => {
              modalFormRef.current?.resetFields();
            },
          },
          render: (props, defaultDoms) => {
            return [
              ...defaultDoms,
              <Button
                key="extra-reset"
                onClick={() => {
                  props.reset();
                }}
              >
                重置2
              </Button>,
            ];
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            modalFormRef.current?.resetFields();
            setCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="name"
        />
        <ProFormTextArea width="md" name="desc" label="desc" />
      </ModalForm>
      {/* 配置规则弹窗 */}
      <ConfigModal
        visible={configModalVisible}
        values={currentRow || {}}
        onCancel={() => {
          handleConfigModalVisible(false);
          setCurrentRow(undefined);
        }}
        onSubmit={async (value) => {
          const success = await handleConfigSubmit(value, currentRow);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
