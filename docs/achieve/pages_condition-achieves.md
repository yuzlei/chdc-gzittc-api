### 获取成就条件分页

#### 基本信息

- **接口名称**：获取成就条件分页
- **接口描述**：用于获取成就条件分页
- **作者**：yvzl
- **版本**：v1.0.0
- **创建日期**：2024-09-18

#### 请求说明

- 请求方式：`GET`
- 请求地址：`http://localhost:3000/api/v1/achieves/pages_condition`

#### 请求头

- 无

#### 路径参数

- 无

#### 请求参数

|   参数名    |   类型   | 是否必填 |   描述    |                                示例                                |
|:--------:|:------:|:----:|:-------:|:----------------------------------------------------------------:|
|   _id    | string |  否   |  动态id   |                     66d70038b770aa94e336e9e0                     |
|  name  | string |  否   | 成就名字 |                    第十五届蓝桥杯大赛 Web 应用开发组全国总决赛二等奖                     |
| imgSrc | string |  否   | 成就图标 | http://localhost:3000/images/achieves/66d70038b770aa94e336e9e0.png |
|   sort   | enum |  否   | 动态排序方向  |                            ascending                             |
| sortName | string |  否   | 动态排序字段名 |                            createdAt                             |
|  limit   | number |  否   |  页条目数量  |                                10                                |
|   page   | number |  否   |   页数    |                                1                                 |

#### 返回结果

```json
{
  "data": [{
  "_id": "66d70038b770aa94e336e9e0",
  "name": "第十五届蓝桥杯大赛 Web 应用开发组全国总决赛二等奖",
  "imgSrc": "http://localhost:3000/images/achieves/66d70038b770aa94e336e9e0.png",
  "createdAt": "2024-09-03T12:25:28.802+00:00",
  "updatedAt": "2024-09-03T12:25:28.802+00:00"
  }],
  "pageTotal": 1
}
```

#### 错误码

| 错误码 |   描述    |
|:---:|:-------:|
| 200 |   成功    |
| 400 | 请求参数错误  |
| 500 | 服务器内部错误 |

#### 备注

- 请确保所有敏感信息在传输过程中进行加密处理
- 本接口支持跨域请求
- sort的枚举值为：ascending、descending，不排序则不传该参数
