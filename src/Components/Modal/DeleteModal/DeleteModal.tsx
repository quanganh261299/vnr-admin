import { Modal } from "antd";
import { FC } from "react";

interface Props {
  title: string;
  open: boolean;
  okText: string;
  cancelText: string;
  description: string;
  handleOk: () => void;
  handleCancel: () => void;
  isLoadingBtn?: boolean;
}

const DeleteModal: FC<Props> = (props: Props) => {
  const { title, open, okText, cancelText, description, isLoadingBtn, handleOk, handleCancel } = props
  return (
    <>
      <Modal
        title={title}
        open={open}
        okText={okText}
        cancelText={cancelText}
        okButtonProps={{ danger: true, loading: isLoadingBtn }}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <p>{description}</p>
      </Modal>
    </>
  )
}

export default DeleteModal