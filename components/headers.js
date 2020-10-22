import { Layout, Button } from 'antd'
import Link from 'next/link'
import config from '../global/configs'

const { Header } = Layout
const Headers = ({ user }) => {
    return (
        <Header className="header">
            <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 21, flex: 1 }}>System Visitor {user.username ? `| ${user.username}` : ''} </div>
                {user.username &&
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 21 }}>
                        <Link href={`${config.url}/users/logout`}>
                            <Button type="primary">Logout</Button>
                        </Link>
                    </div>
                }
            </div>
        </Header>
    )
}

export default Headers