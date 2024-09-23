import { Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { TSystemUser, TUser } from "../../../models/user/user";
import { SelectType } from "../../../models/common";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TSystemUser) => void,
  selectAccountData: SelectType[],
  editingData?: TUser | null,
  isLoadingBtn?: boolean
}

const SystemAccountModal = forwardRef<{ submit: () => void; reset: () => void }, Props>((props, ref) => {
  const {
    isModalOpen,
    editingData,
    isLoadingBtn,
    selectAccountData,
    handleOk,
    handleCancel,
    onFinish
  } = props
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    },
  }));

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        email: editingData?.email,
        roleId: editingData.role.id
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  return (
    <Modal
      title={editingData ? 'Sửa tài khoản hệ thống' : 'Thêm tài khoản hệ thống'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      okButtonProps={{ loading: isLoadingBtn }}
    >
      <Form
        form={form}
        name="form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Chọn role"
          name="roleId"
          rules={[{ required: true, message: 'Bạn phải chọn hệ thống!' }]}
          className='custom-margin-form'
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            options={selectAccountData}
            notFoundContent={'Không có dữ liệu'}
          />
        </Form.Item>

        <Form.Item<TSystemUser>
          label="Email"
          name="email"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống email' }]}
          className='custom-margin-form'
        >
          <Input />
        </Form.Item>

        <Form.Item<TSystemUser>
          label="Password"
          name="password"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống password' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default SystemAccountModal;
