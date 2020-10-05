import React, { FC, useCallback, useState } from "react";
import {
  Spin,
  Layout,
  Form,
  InputNumber,
  Button,
  Statistic,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import { useWeather } from "./utils/useWeather";
import { dewPoint } from "./utils/dewPoint";

export const App: FC = () => {
  const [dewPoints, setDewPoints] = useState<{
    outside: number;
    room: number;
  } | null>(null);

  const outside = useWeather("93420");

  const handleCalculate = useCallback(
    (room: { temperature: number; humidity: number }) => {
      const outsideDewPoint = dewPoint(
        outside.temperature,
        outside.humidity / 100
      );
      const roomDewPoint = dewPoint(room.temperature, room.humidity / 100);

      setDewPoints({
        room: roomDewPoint,
        outside: outsideDewPoint,
      });
    },
    [outside]
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!outside && <Spin size="large" />}

        {outside && !dewPoints && (
          <Form
            size="large"
            layout="horizontal"
            style={{ width: "80%" }}
            onFinish={handleCalculate}
          >
            <Form.Item
              name="temperature"
              rules={[{ required: true, message: "Temperature is required!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Temperature"
                formatter={(value) => (value !== "" ? `${value}°C` : "")}
                parser={(value) => value.replace("°C", "")}
              />
            </Form.Item>
            <Form.Item
              name="humidity"
              rules={[
                { required: true, message: "Relative Humidity is required!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Relative Humidity"
                formatter={(value) => (value !== "" ? `${value}%` : "")}
                parser={(value) => value.replace("%", "")}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Calculate
              </Button>
            </Form.Item>
          </Form>
        )}

        {dewPoints !== null && (
          <>
            <Typography.Title level={4}>Dew Points</Typography.Title>
            <Row gutter={0} style={{ width: "90%" }}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Pendik"
                    value={dewPoints.outside}
                    precision={1}
                    valueStyle={{
                      color:
                        dewPoints.outside > dewPoints.room
                          ? "#3f8600"
                          : "#cf1322",
                    }}
                    suffix="°C"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Room"
                    value={dewPoints.room}
                    precision={1}
                    suffix="°C"
                    valueStyle={{
                      color:
                        dewPoints.outside < dewPoints.room
                          ? "#3f8600"
                          : "#cf1322",
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};
