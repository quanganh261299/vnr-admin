/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styles from './style.module.scss'
import classNames from "classnames/bind";
import { SelectType } from "../../../models/common";
import { TAdvertisementField } from "../../../models/advertisement/advertisement";
import branchApi from "../../../api/branchApi";
import { TAgencyTable } from "../../../models/agency/agency";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import employeeApi from "../../../api/employeeApi";
import { TMemberTable } from "../../../models/member/member";
import organizationApi from "../../../api/organizationApi";
import { TSystemTable } from "../../../models/system/system";
import { TAdUserTable } from "../../../models/user/user";
import advertisementApi from "../../../api/advertisementApi";
import { handleNumber, hasRole, ROLE } from "../../../helper/const";
import TextArea from "antd/es/input/TextArea";

interface Props {
  role: string | null,
  organizationId: string | null,
  branchId: string | null,
  groupId: string | null,
  isModalOpen: boolean,
  handleOk: () => void,
  handleSave: () => void,
  handleCancel: () => void,
  onFinish: (values: TAdvertisementField) => void,
  editingData?: TAdUserTable | null,
  isLoadingOkBtn?: boolean,
  isLoadingSaveBtn?: boolean
}

const AdAccountModal = forwardRef<{ submit: () => void; reset: () => void; saveReset: () => void }, Props>((props, ref) => {
  const {
    role,
    organizationId,
    branchId,
    groupId,
    isModalOpen,
    isLoadingOkBtn,
    isLoadingSaveBtn,
    editingData,
    handleOk,
    handleSave,
    handleCancel,
    onFinish
  } = props
  const cx = classNames.bind(styles)
  const [selectSystemDataModal, setSelectSystemDataModal] = useState<SelectType[]>([])
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectMemberDataModal, setSelectMemberDataModal] = useState<SelectType[]>([])
  const [selectBmDataModal, setSelectBmDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [selectTeamModalId, setSelectTeamModalId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false,
    isSelectBM: false,
  })
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    },
    saveReset: () => {
      form.resetFields(['id']);
    }
  }));

  const handleFormChange = (changedValues: any) => {
    if (changedValues.organizationId) {
      setSelectSystemModalId(changedValues.organizationId)
      setSelectAgencyDataModal([])
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
    if (changedValues.branchId) {
      setSelectAgencyModalId(changedValues.branchId)
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
    if (changedValues.groupId) {
      setSelectTeamModalId(changedValues.groupId)
      setSelectMemberDataModal([])
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    setSelectSystemModalId(null)
    setSelectAgencyModalId(null)
    setSelectTeamModalId(null)
    form.setFieldValue('branchId', undefined)
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectAgencyDataModal([])
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
  }

  const clearSelectAgencyModalId = () => {
    setSelectAgencyModalId(null)
    setSelectTeamModalId(null)
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
  }

  const clearSelectTeamModalId = () => {
    setSelectTeamModalId(null)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
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
    if (selectTeamModalId || groupId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectAgency: false,
        isSelectTeam: false,
        isSelectMember: true,
        isSelectBM: true,
      }))
      employeeApi.getListEmployee({ groupId: selectTeamModalId || groupId || '' }).then((res) => {
        setSelectMemberDataModal(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectMember: false }))
      })
      advertisementApi.getListBm(selectTeamModalId || groupId || '').then((res) => {
        setSelectBmDataModal(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.id
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectBM: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId, selectTeamModalId, organizationId, branchId, groupId])

  useEffect(() => {
    if (editingData) {
      console.log('editingData', editingData)
      setSelectSystemModalId(String(editingData.employee?.group?.branch?.organizationId))
      setSelectAgencyModalId(String(editingData.employee?.group?.branchId))
      setSelectTeamModalId(String(editingData.employee?.groupId))
      form.setFieldsValue({
        name: editingData?.name,
        organizationId: editingData?.employee?.group?.branch?.organizationId,
        branchId: editingData?.employee?.group?.branchId,
        groupId: editingData?.employee?.groupId,
        employeeId: editingData?.employee?.id,
        pms: editingData?.pms?.map((pms) => typeof pms === 'object' && pms.id),
        id: editingData?.accountId,
        typeAccount: editingData?.typeAccount,
        sourceAccount: editingData?.sourceAccount,
        cost: editingData?.cost,
        informationLogin: editingData?.informationLogin
      });
    } else {
      form.resetFields();
      setSelectSystemModalId(null)
      setSelectAgencyModalId(null)
      setSelectTeamModalId(null)
      setSelectAgencyDataModal([])
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      setSelectBmDataModal([])
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
  }, [branchId, editingData, form, groupId, organizationId, role]);


  return (
    <Modal
      title={'Thêm tài khoản quảng cáo'}
      open={isModalOpen}
      centered
      onCancel={handleCancel}
      style={{ maxHeight: '520px', overflowY: 'auto' }}
      footer={(
        <Flex gap={"small"} justify="flex-end">
          <Button onClick={handleCancel}>Cancel</Button>
          {!editingData &&
            <Button
              type="primary"
              onClick={handleSave}
              loading={isLoadingSaveBtn}
            >
              Save & Continue
            </Button>
          }
          <Button
            type="primary"
            onClick={handleOk}
            loading={isLoadingOkBtn}
          >
            Ok
          </Button>
        </Flex>
      )}
    >
      <Form
        form={form}
        name="form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <div className={cx('select-container')}>
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
              options={selectSystemDataModal}
              onClear={clearSelectSystemModalId}
              notFoundContent={'Không có dữ liệu'}
              loading={loading.isSelectSystem}
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
            notFoundContent={selectAgencyModalId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
            onClear={clearSelectTeamModalId}
            disabled={!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role))}
          />
        </Form.Item>
        <Form.Item
          label="Chọn thành viên"
          name="employeeId"
          rules={[{ required: true, message: 'Bạn phải chọn thành viên!' }]}
          className={"custom-margin-form"}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn thành viên"
            options={selectMemberDataModal}
            notFoundContent={selectTeamModalId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
            loading={loading.isSelectMember}
          />
        </Form.Item>
        <Form.Item
          label="Chọn BM"
          name="pms"
          rules={[{ required: true, message: 'Bạn phải chọn ít nhất một id BM!' }]}
          className={"custom-margin-form"}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Chọn ít nhất một id BM"
            options={selectBmDataModal}
            notFoundContent={selectTeamModalId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
            loading={loading.isSelectBM}
          />
        </Form.Item>
        <Form.Item<TAdvertisementField>
          label="Id tài khoản quảng cáo"
          name="id"
          rules={[{ required: true, message: 'Không được để trống Id tài khoản quảng cáo' }]}
          className={cx("custom-margin-form")}
        >
          <Input disabled={editingData ? true : false} />
        </Form.Item>
        <Form.Item
          label="Loại tài khoản"
          name="typeAccount"
          rules={[{ required: true, message: 'Không được để trống loại tài khoản' }]}
          className={cx("custom-margin-form")}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nguồn tài khoản"
          name="sourceAccount"
          rules={[{ required: true, message: 'Không được để trống loại tài khoản' }]}
          className={cx("custom-margin-form")}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá tiền"
          name="cost"
          rules={[{ required: true, message: 'Không được để trống giá tiền' }]}
          className={cx("custom-margin-form")}
          getValueFromEvent={(event) => handleNumber(event)}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Thông tin đăng nhập"
          name="informationLogin"
          rules={[{ required: true, message: 'Không được để trống thông tin đăng nhập' }]}
        >
          <TextArea autoSize={{ minRows: 6, maxRows: 10 }} maxLength={249} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default AdAccountModal;
