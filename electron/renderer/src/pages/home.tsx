import { Button, Checkbox, Input } from "antd";
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";

export function HomePage() {
  function handleInit() {
    try {
      window.core.ping()
    } catch (err) {
      alert(err)
    }
  }
  return (
    <div>
       <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <FormItem<string>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </FormItem>

        <FormItem name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" onClick={handleInit}>
            Init
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}