import { Result, Button, Row, Col } from 'antd'
import Header from '../../../components/headers'
import QRCode from 'qrcode.react'

function Success({ query }) {
    const pid = query.pid.toString()
    const downloadQR = () => {
        const canvas = document.getElementById(`${pid}`);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${pid}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div>
            <Header user={false} />
            <Result
                status="success"
                title="Successfully Register Visit"
                subTitle="You can come to visit by downloading and printing the registration qr code and submit it to the admin"

            />
            <div style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                <QRCode id={pid}
                    value={pid}
                    size={290}
                    style={{ alignSelf: 'center', marginBottom: 20 }}
                    level={"H"}
                />
                <div>
                    <Button type="primary" key="console" onClick={downloadQR}>QR Code Download</Button>
                    <Button href="/" >Go Back </Button>
                </div>
            </div>
        </div>
    )
}

Success.getInitialProps = async ({ query }) => {
    return { query: query }
}



export default Success
