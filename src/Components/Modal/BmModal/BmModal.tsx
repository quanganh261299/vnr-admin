import { Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { SelectType } from "../../../models/common";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import { TBmUser, TBmUserField } from "../../../models/user/user";
import TextArea from "antd/es/input/TextArea";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TBmUserField) => void,
  editingData?: TBmUser | null,
  isLoadingBtn?: boolean
}

const BmModal = forwardRef<{ submit: () => void; reset: () => void }, Props>((props, ref) => {
  const { isModalOpen, editingData, isLoadingBtn, handleOk, handleCancel, onFinish } = props
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
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
      console.log('editingData', editingData)
      form.setFieldsValue({
        email: editingData.email,
        groupId: selectTeamDataModal.find((item) => item.value === editingData.group.id)?.value,
        bmsId: editingData.pms.map((item) => item.id).join(', ')
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  useEffect(() => {
    groupApi.getListGroup(undefined, undefined, undefined, undefined).then((res) => {
      setSelectTeamDataModal(
        res.data.data.map((item: TypeTeamTable) => ({
          value: item.id,
          label: item.name
        }))
      )
    })
  })

  return (
    <Modal
      title={editingData ? 'Sửa tài khoản BM' : 'Thêm tài khoản BM'}
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
            notFoundContent={'Không có dữ liệu '}
          />
        </Form.Item>

        <Form.Item
          label="Id BM (có thể nhập nhiều id, mỗi id ngăn cách nhau bởi dấu ',')"
          name="bmsId"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống id BM' }]}
          className='custom-margin-form'
        >
          <TextArea autoSize />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống email' }]}
          className='custom-margin-form'
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  )
});

export default BmModal;
