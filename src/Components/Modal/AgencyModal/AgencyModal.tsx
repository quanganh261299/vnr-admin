import { Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { TAgencyField } from "../../../models/agency/agency";
import { SelectType } from "../../../models/common";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TAgencyField) => void,
  editingData?: TAgencyField | null,
  selectSystemData: SelectType[],
  isLoadingBtn?: boolean
}

const AgencyModal = forwardRef<{ submit: () => void; reset: () => void }, Props>((props, ref) => {
  const { isModalOpen, editingData, selectSystemData, handleOk, handleCancel, onFinish, isLoadingBtn } = props
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    }
  }));

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        name: editingData?.name,
        description: editingData?.description,
        organizationId: selectSystemData.find((item) => item.value === editingData.organization?.id)?.value
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  return (
    <Modal
      title={editingData ? 'Sửa chi nhánh' : 'Thêm chi nhánh'}
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
          label="Chọn hệ thống"
          name="organizationId"
          className="custom-margin-form"
          rules={[{ required: true, message: 'Không được để trống hệ thống' }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            options={selectSystemData}
            notFoundContent={'Không có dữ liệu'}
          />
        </Form.Item>
        <Form.Item<TAgencyField>
          label="Tên chi nhánh"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống tên chi nhánh' }]}
          className="custom-margin-form"
        >
          <Input />
        </Form.Item>

        <Form.Item<TAgencyField>
          label="Ghi chú"
          name="description"
        >
          <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} maxLength={249} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default AgencyModal;
