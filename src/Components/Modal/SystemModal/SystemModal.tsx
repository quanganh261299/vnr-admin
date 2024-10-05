import { Form, Input, Modal } from "antd"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { TSystemField } from "../../../models/system/system";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TSystemField) => void,
  editingData?: TSystemField | null,
  isLoadingBtn?: boolean
}

const SystemModal = forwardRef<{ submit: () => void; reset: () => void }, Props>((props, ref) => {
  const { isModalOpen, editingData, isLoadingBtn, handleOk, handleCancel, onFinish } = props
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
        name: editingData?.name,
        description: editingData?.description,
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  return (
    <Modal
      title={editingData ? 'Sửa hệ thống' : 'Thêm hệ thống'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      okButtonProps={{ loading: isLoadingBtn }}
      maskClosable={false}
    >
      <Form
        form={form}
        name="form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<TSystemField>
          label="Tên hệ thống"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống tên hệ thống' }]}
          className='custom-margin-form'
        >
          <Input />
        </Form.Item>

        <Form.Item<TSystemField>
          label="Ghi chú"
          name="description"
        >
          <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} maxLength={249} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default SystemModal;
