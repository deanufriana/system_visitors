import { useState, useEffect } from 'react'
import {
  Button, Layout, Input, Form, DatePicker, Spin, Alert, Radio, Select, Row, Col
} from "antd";
import config from '../global/configs'
import { useRouter } from 'next/router'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Headers from '../components/headers'

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isLoadingStatistic, setIsLoadingStatistic] = useState(false)
  const [alert, setAlert] = useState({})
  const [statistic, setStatistic] = useState([])
  const { Option } = Select;

  const onFinishForm = async (values) => {
    setLoading(true)
    const { success, message, extra: { lastID } } = await fetch(`${config.url}/visitors/register_visit`,
      { method: "POST", body: JSON.stringify({ ...values, visit_date: values.visit_date.format('YYYY-MM-DD') }) })
      .then(res => res.json())
    setLoading(false)
    setAlert({ type: success ? "success" : "error", message })
    if (success) router.push(`/success/register/${lastID}`)
  };
  async function fetchStatisticData() {
    setIsLoadingStatistic(true)
    const { success, resdata } = await fetch(`${config.url}/visitors/statistic_visitor`,
      { method: "POST" })
      .then(res => res.json())
    setStatistic(resdata)
    setIsLoadingStatistic(false)
  }
  useEffect(() => {
    fetchStatisticData();
  }, []);

  function disabledDate(current) {
    return current < new Date()
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="62">
      <Select style={{ width: 70 }}>
        <Option value="62">+62</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Layout>
      <Headers user={false} />
      <Layout style={{ height: "90vh", marginLeft: 20, marginRight: 20, marginTop: 20 }}>
        <Row>
          <Col flex="auto" style={{ textAlign: 'left', minWidth: '400px' }}>
            <div style={{ height: 600, backgroundColor: 'white' }}>
              <div style={{ padding: 20, backgroundColor: 'black', fontWeight: 900, color: "white" }}> Register Form </div>
              <Form
                layout='vertical'
                initialValues={{ remember: false }}
                form={form}
                style={{ padding: 20 }}
                onFinish={onFinishForm}>
                <Form.Item
                  label="Name"
                  name="name"
                  required
                  tooltip="your name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Gender"
                  name="gender"
                  required
                  rules={[{ required: true, message: 'Please input your gender!' }]}
                  tooltip="your gender">
                  <Radio.Group>
                    <Radio.Button value="Male">Male</Radio.Button>
                    <Radio.Button value="Female">Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  tooltip="your email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input type="email" />
                </Form.Item>
                <Form.Item
                  label="Date Visit"
                  name="visit_date"
                  required
                  tooltip="your date visit"
                  rules={[{ required: true, message: 'Please input your date visit!' }]}
                >
                  <DatePicker disabledDate={disabledDate} format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" disabled={isLoading} style={{ width: "100%" }} htmlType="submit"> {isLoading ? <Spin size="small"></Spin> : "Register"} </Button>
                </Form.Item>
                {alert.message && <Alert message={alert.message} type={alert.type}></Alert>}
              </Form>
            </div>
          </Col>

          <Col flex="auto">
            <div style={{ backgroundColor: 'white', height: 600 }}>
              <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div style={{ padding: 20, flex: 1, fontWeight: 900, fontSize: 20 }}> Statistic Visitor </div>
                <div style={{ marginRight: 20, alignSelf: 'center' }}>
                  <Button onClick={fetchStatisticData} disabled={isLoadingStatistic} type="primary">{isLoadingStatistic ? <Spin size="small"></Spin> : 'Reload'}</Button>
                </div>
              </div>

              <ResponsiveContainer height={500}>
                <LineChart data={statistic} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line name="Visit Date" type="monotone" dataKey="total" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="visit_date" />
                  <YAxis />
                  <Legend verticalAlign="top" height={36} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Layout>
    </Layout>
  )
}