<template>
    <span>
        <Button type="primary"  icon="android-add" @click = "showNewUserModel('newUserData')">新建会员</Button>
        <Modal v-model="newUserModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center" class = "red" >
                <Icon type="android-add"></Icon>
                <span>新建会员</span>
            </p>
            <Form ref="newUserData" :model="newUserData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options="options1" v-model="add_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="门店" prop="shop_id">
                    <Select v-model="newUserData.shop_id" placeholder="选择门店..." @on-change="getEmpList">
                        <Option v-for="item in storeList" :value = item.shop_id :key = item.shop_id>{{ item.shop_name }}</Option>
                    </Select>
                </Form-item>

                <Form-item label="姓名" prop="user_name">
                    <Input v-model="newUserData.user_name" placeholder="会员姓名..."></Input>
                </Form-item>
                <Form-item label="手机" prop="phone_no">
                    <Input v-model="newUserData.phone_no" placeholder="会员手机..."></Input>
                </Form-item>

                <Form-item label="美疗师" prop="emp_id">
                    <Select v-model="newUserData.emp_id" placeholder="请选择美疗师...">
                        <Option v-for="item in empData" :value = item.emp_id :key = item.emp_id>{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Form-item label= "生日" prop="birthday">
                    <Date-picker type="date" format = "yyyy-MM-dd" placeholder="选择日期" :options="options1" v-model="birthday" style="width: 180px" ></Date-picker>
                </Form-item>

                <Form-item label="到店渠道" prop="source">
                    <Select v-model="newUserData.source" placeholder="到店渠道...">
                        <Option v-for="source in globalConfig.user_channel" :value = source :key = source>{{ source }}</Option>
                    </Select>
                </Form-item>

                <Form-item label="介绍" prop="remark">
                    <Input v-model="newUserData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>

            </Form>

            <p slot="footer">
                <Button type="primary" @click="handleSubmit('newUserData')">确认添加</Button>
                <Button type="ghost" @click="handleReset('newUserData')" style="margin-left: 8px">重 置</Button>
            </p>

        </Modal>
    </span>
</template>
<script>

    import { addUser } from '../api/user'
    import { getEmployeeList } from '../api/employee'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            globalConfig: Object,
            storeList: Array,
            shopConfig: Object
        },
        data () {
            return {
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                newUserModel: false,
                empData:[],
                add_time: new Date(),
                birthday: "",
                newUserData: {
                    user_name: "",
                    phone_no: "",
                    birthday: "",
                    emp_id: "",
                    source: "",
                    add_time: "",
                    shop_id: "",
                    remark: ""
                },
                ruleValidate: {
                    user_name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    phone_no: [
                        { required: true, message: '手机不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getEmpList() {
                this.empData = []
                getEmployeeList({
                    shop_id: this.newUserData.shop_id,
                    cur_page:1,
                    limit: 1000
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.empData = response.data.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.newUserData.add_time = formatDate(this.add_time, "yyyy-MM-dd HH:mm:ss")
                        this.newUserData.birthday = formatDate(this.birthday, "yyyy-MM-dd")
                        addUser(this.newUserData).then((response) => {
                            if (0 !== response.statusCode) {
                                this.$Message.error(response.msg)
                            } else {
                                this.$Message.success('提交成功!')
                                this.newUserModel = false
                                this.$emit('addUser')
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            },
            showNewUserModel(name) {
                this.newUserModel = true
                this.$refs[name].resetFields()
                this.add_time = new Date()
            }
        }
    }
</script>
