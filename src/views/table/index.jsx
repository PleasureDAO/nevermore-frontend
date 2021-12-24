import React, { Component } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  Divider,
  message,
  Select
} from "antd";
import { tableList, deleteItem, editItem } from "@/api/table";
import EditForm from "./forms/editForm"
const { Column } = Table;
const { Panel } = Collapse;
class TableComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [],
    loading: false,
    total: 0,
    listQuery: {
      pageNumber: 1,
      pageSize: 10,
      title: "",
      star: "",
      status: ""
    },
    editModalVisible: false,
    editModalLoading: false,
    currentRowData: {
      contract: 0,
      name: "",
      symbol: "",
      decimals: "",
      birth_date: "",
      source_code: "",
      abi: ""
    }
  };
  fetchData = () => {
    this.setState({ loading: true });
    tableList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      const list = response.data.rows;
      const total = response.data.rows.length;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterTitleChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        title: value,
      }
    }));
  };
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value,
      }
    }));
  };
  filterStarChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        star: value,
      }
    }));
  };
  changePage = (pageNumber, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  changePageSize = (current, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber: 1,
          pageSize,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  handleDelete = (row) => {
    deleteItem({ id: row.id }).then(res => {
      message.success("删除成功")
      this.fetchData();
    })
  }
  handleEdit = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editModalVisible: true,
    });
  };

  handleOk = _ => {
    const { form } = this.formRef.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        'star': "".padStart(fieldsValue['star'], '★'),
        'date': fieldsValue['date'].format('YYYY-MM-DD HH:mm:ss'),
      };
      this.setState({ editModalLoading: true, });
      editItem(values).then((response) => {
        form.resetFields();
        this.setState({ editModalVisible: false, editModalLoading: false });
        message.success("编辑成功!")
        this.fetchData()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })

    });
  };

  handleCancel = _ => {
    this.setState({
      editModalVisible: false,
    });
  };
  render() {
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="协议:">
                <Input onChange={this.filterTitleChange} />
              </Form.Item>
              <Form.Item label="缩写">
                <Input onChange={this.filterTitleChange} />
              </Form.Item>
              <Form.Item label="类型:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value="published">published</Select.Option>
                  <Select.Option value="draft">draft</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="推荐指数:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterStarChange}>
                  <Select.Option value={1}>★</Select.Option>
                  <Select.Option value={2}>★★</Select.Option>
                  <Select.Option value={3}>★★★</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" onClick={this.fetchData}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Table
          bordered
          rowKey={(record) => record.contract}
          dataSource={this.state.list}
          loading={this.state.loading}
          pagination={false}
          scroll={{ x: '100%' }}
        >
          {
            /*
             contract: 0,
      name: "",
      symbol: "",
      decimals: "",
      birth_date: "",
      source_code: "",
      abi: ""
            */
          }
          <Column title="缩写" dataIndex="symbol" key="symbol" width={100} align="center" />
          <Column title="全称" dataIndex="name" key="name" width={200} align="center" />
          <Column title="协议" dataIndex="contract" key="contract" width={400} align="center" />
          <Column title="小数点" dataIndex="decimals" key="decimals" width={195} align="center" />
          <Column title="源码" dataIndex="source_code" key="source_code" width={195} align="center" render={(source_code) => {
            let has = source_code.length > 0;
            return (
              <Tag color={`red`} key={1}>
                {has ? '有' : "无"}
              </Tag>
            );
          }} />

          <Column title="ABI" dataIndex="abi" key="abi" width={195} align="center" render={(abi) => {
            let has = abi.length > 0;
            return (
              <Tag color={`red`} key={1}>
                {has ? '有' : "无"}
              </Tag>
            );
          }} />

        </Table>
        <br />
        <Pagination
          total={this.state.total}
          pageSizeOptions={["10", "20", "40"]}
          showTotal={(total) => `共${total}条数据`}
          onChange={this.changePage}
          current={this.state.listQuery.pageNumber}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
          hideOnSinglePage={true}
        />
        <EditForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.formRef = formRef}
          visible={this.state.editModalVisible}
          confirmLoading={this.state.editModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </div>
    );
  }
}

export default TableComponent;
