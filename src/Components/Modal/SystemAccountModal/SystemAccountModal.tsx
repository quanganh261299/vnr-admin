import { Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { TSystemUser, TUser } from "../../../models/user/user";
import { SelectType } from "../../../models/common";
import organizationApi from "../../../api/organizationApi";
import { TSystemTable } from "../../../models/system/system";
import classNames from "classnames";
import styles from './style.module.scss'
import { TAgencyTable } from "../../../models/agency/agency";
import { TypeTeamTable } from "../../../models/team/team";
import groupApi from "../../../api/groupApi";
import branchApi from "../../../api/branchApi";
import { EMAIL_REGEX, hasRole, ROLE } from "../../../helper/const";
import { useTranslation } from "react-i18next";

interface Props {
  organizationId: string | null
  branchId: string | null
  role: string | null,
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
    organizationId,
    branchId,
    role,
    isModalOpen,
    editingData,
    isLoadingBtn,
    selectAccountData,
    handleOk,
    handleCancel,
    onFinish
  } = props
  const cx = classNames.bind(styles)
  const [form] = Form.useForm();
  const [selectSystemDataModal, setSelectSystemDataModal] = useState<SelectType[]>([])
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [roleId, setRoleId] = useState<string>('')
  const [loading, setLoading] = useState({
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
  })
  const { t } = useTranslation()

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    },
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (changedValues: any) => {
    if (changedValues.roleId) {
      setRoleId(changedValues.roleId)
    }
    setSelectSystemModalId(changedValues.organizationId)
    setSelectAgencyModalId(changedValues.branchId)
    if (changedValues.organizationId) {
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
    }
    if (changedValues.branchId) {
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
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemDataModal(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false }))
    })
  }, [])

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
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
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
    if (editingData) {
      setRoleId(editingData.role.id)
      setSelectSystemModalId(editingData.organizationId || '')
      setSelectAgencyModalId(editingData.branchId || '')
      form.setFieldsValue({
        email: editingData?.email,
        roleId: editingData.role.id,
        organizationId: editingData.organizationId,
        branchId: editingData.branchId,
        groupId: editingData.groupId
      });
    } else {
      setRoleId('')
      form.resetFields();
      if (!hasRole([ROLE.ADMIN], String(role))) {
        form.setFieldsValue({ organizationId: organizationId });
      }
      if (!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))) {
        form.setFieldsValue({ branchId: branchId })
      }
      if (role === ROLE.BRANCH) {
        setRoleId(String(selectAccountData.find((item) => item.label === t(`roles.${ROLE.GROUP}`))?.value))
        form.setFieldValue('roleId', selectAccountData.find((item) => item.label === t(`roles.${ROLE.GROUP}`))?.value)
      }
    }
  }, [editingData, form, role, selectAccountData, branchId, organizationId, t]);

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
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Chọn role"
          name="roleId"
          rules={[{ required: true, message: 'Bạn phải chọn role!' }]}
          className='custom-margin-form'
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn role"
            options={selectAccountData}
            notFoundContent={'Không có dữ liệu'}
            disabled={!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))}
          />
        </Form.Item>

        {
          hasRole(
            [t(`roles.${ROLE.ORGANIZATION}`), t(`roles.${ROLE.BRANCH}`), t(`roles.${ROLE.GROUP}`)],
            String(selectAccountData.find((item) => item.value === roleId)?.label)
          ) &&
          <Form.Item<TSystemUser>
            label="Chọn hệ thống"
            name="organizationId"
            rules={[{ required: true, message: 'Bạn phải chọn hệ thống!' }]}
            className={cx("custom-select-form", "custom-margin-form")}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn hệ thống"
              options={selectSystemDataModal}
              onClear={clearSelectSystemModalId}
              notFoundContent={'Không có dữ liệu'}
              disabled={!hasRole([ROLE.ADMIN], String(role))}
            />
          </Form.Item>
        }
        {
          hasRole(
            [t(`roles.${ROLE.BRANCH}`), t(`roles.${ROLE.GROUP}`)],
            String(selectAccountData.find((item) => item.value === roleId)?.label)
          ) &&
          <Form.Item<TSystemUser>
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
        }

        {
          hasRole(
            [t(`roles.${ROLE.GROUP}`)],
            String(selectAccountData.find((item) => item.value === roleId)?.label)
          ) &&
          <Form.Item<TSystemUser>
            label="Chọn đội nhóm"
            name="groupId"
            rules={[{ required: true, message: 'Bạn phải chọn đội nhóm!' }]}
            className={cx("custom-margin-form")}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn đội nhóm"
              options={selectTeamDataModal}
              notFoundContent={selectAgencyModalId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
              loading={loading.isSelectTeam}
            />
          </Form.Item>
        }


        <Form.Item<TSystemUser>
          label="Email"
          name="email"
          rules={[
            { required: true, whitespace: true, message: 'Không được để trống email' },
            { pattern: EMAIL_REGEX, message: 'Email chưa đúng định dạng' }
          ]}
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
