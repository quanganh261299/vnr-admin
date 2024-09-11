import styles from './style.module.scss'
import { Button, Form, FormProps, Input, message, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { EMAIL_REGEX } from '../../helper/const';
import { SelectType } from '../../models/common';
import headerCreateImg from '../../assets/images/header-create.webp'
import { TCreateUser, TUserOption } from '../../models/user/user';
import userApi from '../../api/userApi';

const CreateOrganizationAccount = () => {
  const [selectAccountData, setSelectAccountData] = useState<SelectType[]>([])
  // const [selectedAccountLabel, setSelectedAccountLabel] = useState<string>('ADMIN')
  const [loading, setLoading] = useState({
    isSelectTeam: false,
    isSelectAccount: false,
    isBtn: false
  })
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;

  const onFinish: FormProps<TCreateUser>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    userApi.createUser(values).then(() => {
      success('Tạo tài khoản thành công!')
      setLoading({ ...loading, isBtn: false })
    }).catch((err) => {
      console.log('err', err)
      error('Tạo tài khoản thất bại!')
      setLoading({ ...loading, isBtn: false })
    })
  };

  const handleAccountChange = (value: string) => {
    const selectedAccount = selectAccountData.find(account => account.value === value);
    if (selectedAccount) {
      // setSelectedAccountLabel(selectedAccount.label);
    }
  };

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  useEffect(() => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      isSelectTeam: true,
      isSelectAccount: true,
    }));
    userApi.getRole().then((res) => {
      setSelectAccountData(
        res.data.data.filter((item: TUserOption) => item.name === 'ADMIN').map((item: TUserOption) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAccount: false }))
    })
  }, [])

  return (
    <>
      <div className={styles["container"]}>
        {contextHolder}
        <img
          src={headerCreateImg}
          alt=""
          className={styles["header-img"]}
        />
        <Title level={2} className={styles["header"]}>TẠO TÀI KHOẢN</Title>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={styles["create-account-form"]}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 32 }}
        >
          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: 'Bạn phải chọn loại tài khoản!' }]}
            className='custom-margin-form'
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn loại tài khoản"
              onChange={handleAccountChange}
              options={selectAccountData}
              loading={loading.isSelectAccount}
            />
          </Form.Item>

          <Form.Item<TCreateUser>
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Không được để trống email!'
              },
              { pattern: EMAIL_REGEX, message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TCreateUser>
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Không được để password trống!'
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className={styles['submit-btn']}
              htmlType="submit"
              loading={loading.isBtn}
            >
              <span className={loading.isBtn ? styles['btn-margin'] : ''}>Tạo tài khoản</span>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default CreateOrganizationAccount