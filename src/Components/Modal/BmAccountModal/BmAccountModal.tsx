/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { SelectType } from "../../../models/common";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import { TBmUser, TBmUserField } from "../../../models/user/user";
import { TAgencyTable } from "../../../models/agency/agency";
import branchApi from "../../../api/branchApi";
import styles from './style.module.scss'
import { EMAIL_REGEX } from "../../../helper/const";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TBmUserField) => void,
  editingData?: TBmUser | null,
  selectSystemData: SelectType[],
  isLoadingBtn?: boolean
}

const BmAccountModal = forwardRef<{ submit: () => void; reset: () => void }, Props>((props, ref) => {
  const {
    isModalOpen,
    editingData,
    isLoadingBtn,
    selectSystemData,
    handleOk,
    handleCancel,
    onFinish
  } = props
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isSelectAgency: false,
    isSelectTeam: false
  })
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    },
  }));

  const handleFormChange = (changedValues: any) => {
    if (changedValues.organizationId) {
      setSelectSystemModalId(changedValues.organizationId)
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
    }
    if (changedValues.branchId) {
      setSelectAgencyModalId(changedValues.branchId)
      form.setFieldValue('groupId', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    form.setFieldValue('branchId', undefined)
    form.setFieldValue('groupId', undefined)
    setSelectAgencyDataModal([])
    setSelectTeamDataModal([])
  }

  const clearSelectAgencyModalId = () => {
    form.setFieldValue('groupId', undefined)
    setSelectTeamDataModal([])
  }

  useEffect(() => {
    if (editingData) {
      setSelectSystemModalId(editingData?.group?.branch.organization.id as string)
      setSelectAgencyModalId(editingData?.group?.branch.id as string)
      form.setFieldsValue({
        organizationId: editingData?.group?.branch?.organization.id,
        branchId: editingData.group?.branch.id,
        groupId: editingData.group.id,
        email: editingData.email,
        bmsId: editingData.pms.map((item) => item.id)
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  useEffect(() => {
    if (selectSystemModalId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: true }))
      branchApi.getListBranch({ organizationId: selectSystemModalId }).then((res) => {
        setSelectAgencyDataModal(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyModalId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: true }))
      groupApi.getListGroup({ branchId: selectAgencyModalId }).then((res) => {
        setSelectTeamDataModal(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId])

  return (
    <Modal
      title={editingData ? 'Sửa tài khoản BM' : 'Thêm tài khoản BM'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      okButtonProps={{ loading: isLoadingBtn }}
      style={{ maxHeight: '520px', overflowY: 'auto' }}
    >
      <Form
        form={form}
        name="form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        onValuesChange={handleFormChange}
        initialValues={{ bmsId: [''] }}
      >
        <div className={styles["select-form"]}>
          <Form.Item
            label="Chọn hệ thống"
            name="organizationId"
            rules={[{ required: true, message: 'Bạn phải chọn hệ thống!' }]}
            className={styles["custom-select-form"]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn hệ thống"
              options={selectSystemData}
              onClear={clearSelectSystemModalId}
              notFoundContent={'Không có dữ liệu'}
            />
          </Form.Item>
          <Form.Item
            label="Chọn chi nhánh"
            name="branchId"
            rules={[{ required: true, message: 'Bạn phải chọn chi nhánh!' }]}
            className={styles["custom-select-form"]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn chi nhánh"
              options={selectAgencyDataModal}
              onClear={clearSelectAgencyModalId}
              notFoundContent={selectSystemModalId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
              loading={loading.isSelectAgency}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Chọn đội nhóm"
          name="groupId"
          rules={[{ required: true, message: 'Bạn phải chọn đội nhóm!' }]}
          className={"custom-margin-form"}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn đội nhóm"
            options={selectTeamDataModal}
            notFoundContent={selectAgencyModalId ? 'Không có dữ liệu ' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
          />
        </Form.Item>


        <Form.List name="bmsId">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Flex align="center" gap={"small"}>
                    <div style={{ flex: 1 }}>
                      <Form.Item
                        label={index === 0 ? 'Thêm Id BM (có thể thêm nhiều)' : ''}
                        name={[field.name]}
                        key={field.key}
                        rules={[{ required: true, whitespace: true, message: 'Không được để trống id BM' }]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    {index !== 0 && <MinusCircleOutlined onClick={() => remove(field.name)} className={styles['minus-icon']} />}
                  </Flex>

                )
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm Id BM
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, whitespace: true, message: 'Không được để trống email' },
            { pattern: EMAIL_REGEX, message: 'Email không đúng định dạng' },
          ]}
          className='custom-margin-form'
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  )
});

export default BmAccountModal;
