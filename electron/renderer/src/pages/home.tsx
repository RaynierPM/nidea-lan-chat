import { Button, Checkbox, Input, FormProps } from "antd";
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { ValidationError } from "../../../../client/errors/core.error"; 
import { useState } from "react";
import { ConnectionInfo } from "../../../../common/interfaces/Chat.interface";

type InitFormType = {
  username: string
}

export function HomePage() {
  const [foundedRooms, setFoundedRooms] = useState<ConnectionInfo[]>([])

  const  handleInit: FormProps<InitFormType>['onFinish'] = (values) => {
    try {
      window.core.init(values.username)
    } catch (err) {
      alert((err as ValidationError))
    }
  }

  async function handleSearch() {
    try {
      const rooms = await window.core.searchRooms()
      setFoundedRooms(rooms)
    } catch (err) {
      alert((err as ValidationError))
    }
  }

  return (
    <div>
       <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleInit}
        autoComplete="off"
      >
        <FormItem<InitFormType>
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
          <Button type="primary" htmlType="submit">
            Init
          </Button>
        </FormItem>
      </Form>

      <div>
        <div style={{display: "flex", gap: "5px"}}>
          <h2>Available rooms:</h2> <Button onClick={handleSearch}>Search</Button>
        </div>
        <ul>
          {!foundedRooms.length? 
            <li>No founded rooms on the networks</li>
            :
            foundedRooms.map(room => (
              <li>{room.room.name}:{room.room.user?.username}</li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}