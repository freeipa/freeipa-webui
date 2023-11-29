import React from "react";
// Modals
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// PatternFly
import { Button, Text, TextVariants } from "@patternfly/react-core";
// Components
import HelperTextWithIcon from "../layouts/HelperTextWithIcon";
// qrcode.react
import { QRCodeCanvas } from "qrcode.react";

interface PropsToQrCodeModal {
  isOpen: boolean;
  onClose: () => void;
  QrUri: string;
}

/*
 * qrcode.react library documentation:
 * https://github.com/zpao/qrcode.react
 */

const QrCodeModal = (props: PropsToQrCodeModal) => {
  // Banner messages
  const messageQrConfiguration =
    "Configure your token by scanning the QR code below. Click on the QR code if you see this on the device you want to configure.";

  const messageQrViaFreeOtp = (
    <Text component={TextVariants.p}>
      You can use{" "}
      <a href="https://freeotp.github.io/" target="_blank" rel="noreferrer">
        FreeOTP
      </a>{" "}
      as a software OTP token application.
    </Text>
  );

  // Generate QR code
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (props.QrUri) {
      setUrl(props.QrUri);
    }
  }, [props.QrUri]);

  const qrCode = (
    <>
      <a href={url} target="_blank" rel="noreferrer">
        <QRCodeCanvas
          id="qrCode"
          value={url}
          size={400}
          bgColor={"#ffffff"}
          level={"H"}
        />
      </a>
    </>
  );

  // List of fields
  const fields = [
    {
      id: "banner-info-1",
      pfComponent: (
        <HelperTextWithIcon
          message={messageQrConfiguration}
          type="info"
          useDefaultIcons={false}
        />
      ),
    },
    {
      id: "banner-info-2",
      pfComponent: (
        <HelperTextWithIcon
          message={messageQrViaFreeOtp}
          type="info"
          useDefaultIcons={false}
        />
      ),
    },
    {
      id: "qr-code",
      pfComponent: (
        <div style={{ width: "100%", textAlign: "center" }}>{qrCode}</div>
      ),
    },
  ];

  // Actions
  const actions = [
    <Button key="ok" variant="link" onClick={props.onClose}>
      Ok
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      title="Configure your token"
      formId="configure-your-token-form"
      fields={fields}
      show={props.isOpen}
      onClose={props.onClose}
      actions={actions}
    />
  );
};

export default QrCodeModal;
