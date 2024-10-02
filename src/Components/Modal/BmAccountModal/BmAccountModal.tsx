/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { SelectType } from "../../../models/common";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import { TBmUser, TBmUserField } from "../../../models/user/user";
import { TAgencyTable } from "../../../models/agency/agency";
import branchApi from "../../../api/branchApi";
import styles from './style.module.scss'
import classNames from "classnames/bind";
import { EMAIL_REGEX, hasRole, ROLE } from "../../../helper/const";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface Props {
  role: string | null,
  organizationId: string | null,
  branchId: string | null,
  groupId: string | null,
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
    role,
    organizationId,
    branchId,
    groupId,
    isModalOpen,
    editingData,
    isLoadingBtn,
    selectSystemData,
    handleOk,
    handleCancel,
    onFinish
  } = props
  const cx = classNames.bind(styles)
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
        bms: editingData.pms.map((item) => ({ ...item, bmId: item.id, cost: (item.cost || '').toString() })),
        chatId: editingData.chatId,
      });
    } else {
      form.resetFields();
      if (!hasRole([ROLE.ADMIN], String(role))) {
        form.setFieldsValue({ organizationId: organizationId });
      }
      if (!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))) {
        form.setFieldsValue({ branchId: branchId })
      }
      if (!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role))) {
        form.setFieldsValue({ groupId: groupId })
      }
    }
  }, [editingData, form, organizationId, branchId, groupId, role]);

  useEffect(() => {
    if (selectSystemModalId || organizationId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: true }))
      branchApi.getListBranch({ organizationId: selectSystemModalId || organizationId || '' }).then((res) => {
        setSelectAgencyDataModal(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyModalId || branchId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: true }))
      groupApi.getListGroup({ branchId: selectAgencyModalId || branchId || '' }).then((res) => {
        setSelectTeamDataModal(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId, organizationId, branchId])

  useEffect(() => {
    const modalBody = document.querySelector('.ant-modal-content');
    if (modalBody) {
      modalBody.scrollIntoView({
        block: 'start',
      });
    }
  }, [isModalOpen]);

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
        initialValues={{ bms: [''] }}
      >
        <div className={cx("select-form")}>
          <Form.Item
            label="Chọn hệ thống"
            name="organizationId"
            rules={[{ required: true, message: 'Bạn phải chọn hệ thống!' }]}
            className={cx("custom-select-form", "custom-margin-form")}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn hệ thống"
              options={selectSystemData}
              onClear={clearSelectSystemModalId}
              notFoundContent={'Không có dữ liệu'}
              disabled={!hasRole([ROLE.ADMIN], String(role))}
            />
          </Form.Item>
          <Form.Item
            label="Chọn chi nhánh"
            name="branchId"
            rules={[{ required: true, message: 'Bạn phải chọn chi nhánh!' }]}
            className={cx("custom-select-form", "custom-margin-form")}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn chi nhánh"
              options={selectAgencyDataModal}
              onClear={clearSelectAgencyModalId}
              notFoundContent={selectSystemModalId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
              loading={loading.isSelectAgency}
              disabled={!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))}
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
            disabled={!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role))}
          />
        </Form.Item>


        <Form.List name="bms">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Card
                    size="small"
                    key={field.key}
                    title={`BM ${index + 1}`}
                    style={{ marginBottom: '15px' }}
                    extra={index !== 0 && (
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    )}
                  >
                    <Form.Item
                      label={'Id BM'}
                      name={[field.name, 'bmId']}
                      key={`bmId-${field.key}`}
                      rules={[{ required: true, whitespace: true, message: 'Không được để trống id BM' }]}
                      className={cx('custom-margin-form')}
                    >
                      <Input />
                    </Form.Item>
                    <Flex gap="small">
                      <Form.Item
                        label={'Loại tài khoản'}
                        name={[field.name, 'typeAccount']}
                        key={`typeAccount-${field.key}`}
                        rules={[{ required: true, whitespace: true, message: 'Không được để trống loại tài khoản' }]}
                        className={cx('custom-margin-form', 'flex-input')}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={'Nguồn tài khoản'}
                        name={[field.name, 'sourceAccount']}
                        key={`sourceAccount-${field.key}`}
                        rules={[{ required: true, whitespace: true, message: 'Không được để trống nguồn tài khoản' }]}
                        className={cx('custom-margin-form', 'flex-input')}
                      >
                        <Input />
                      </Form.Item>
                    </Flex>
                    <Form.Item
                      label={'Giá tiền'}
                      name={[field.name, 'cost']}
                      key={`cost-${field.key}`}
                      rules={[{ required: true, whitespace: true, message: 'Không được để trống giá tiền' }]}
                      className={cx('custom-margin-form')}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={'Thông tin đăng nhập'}
                      name={[field.name, 'informationLogin']}
                      key={`informationLogin-${field.key}`}
                      rules={[{ required: true, whitespace: true, message: 'Không được để trống thông tin đăng nhập' }]}
                      className={cx('custom-margin-form')}
                    >
                      <TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={249} />
                    </Form.Item>
                  </Card>
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

        <Form.Item
          label="Chat id"
          name="chatId"
          rules={[
            { required: true, whitespace: true, message: 'Không được để trống chat id' },
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
