<template>
    <div>
        <table class="calendar">
            <thead>
            <tr>
                <th class="calendar-head">周日</th>
                <th class="calendar-head">周一</th>
                <th class="calendar-head">周二</th>
                <th class="calendar-head">周三</th>
                <th class="calendar-head">周四</th>
                <th class="calendar-head">周五</th>
                <th class="calendar-head">周六</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="week in dates">
                <td class="full-calendar-cell" :class="{'last-calendar-cell': day.type === 'last', 'next-calendar-cell': day.type === 'next', 'full-calendar-today': day.year+'/'+day.month+'/'+day.date === now.toLocaleDateString()}" v-for="day in week">
                    <div class="full-calendar-date">
                        <div class="clearfix">
                            <div class="full-calendar-value">{{day.date}}</div>
                        </div>
                        <div class="full-calendar-content">
                            <ul class="events">
                                <li v-for="(item, key) in orderTimeData[day.date]" @click="showDetail(item, day.date)">
                                    {{ key }}
                                    &nbsp;
                                    {{item.user_num}} 人
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>


        <div v-for="time in orderTimes">
            <orderTimeTable
                :orderTimeData = time
            ></orderTimeTable>
        </div>

        <Modal v-model="showModel" width="720">
            <p slot="header" style="color:#f60;text-align:center">
                <span> {{year + "年" + month + "月" + currentDay + "日" }} * {{currentShopName}} * 预约详情</span>
            </p>
            <orderTimeTable
                    :orderTimeData = currentData
            ></orderTimeTable>

            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>

<script>
    import orderTimeTable from './orderTimeTable.vue'
    import { getOrderTimeView } from '../api/analysis'
    import { formatDate } from '../utils/utils'
    export default {

        components: { orderTimeTable },
        props: {
            year: Number,
            month: Number,
            orderTimeData: Object,
        },
        data () {
            return {
                showModel: false,
                orderTimeInfo: [],
                orderTimes:[],
                orderIndex:[],
                currentData: [],
                currentDay: "",
                currentShopName: "",
                dates: [],
                now: new Date()
            }
        },
        created() {
            this.render()
        },

        watch: {
            'month': 'render'
        },

        methods: {
            render () {
                let year = this.year
                let month = this.month
                this.dates = []
                // 渲染日历信息
                const days = []
                for (let i = 1, len = (new Date(year, month, 0)).getDate(); i <= len; i++) {
                    days.push({
                        type: 'current',
                        date: i,
                        month: month,
                        year: year
                    })
                }
                for (let i = 1, len = (new Date(year, month - 1, 1)).getDay(); i <= len; i++) {
                    days.unshift({
                        type: 'last',
                        date: ' ',
                        month: month === 1 ? 12 : month - 1,
                        year: month === 1 ? year - 1 : year
                    })
                }
                for (let i = 1, len = 6 - (new Date(year, month, 0)).getDay(); i <= len; i++) {
                    days.push({
                        type: 'next',
                        date: ' ',
                        month: month === 12 ? 1 : month + 1,
                        year: month === 12 ? year + 1 : year
                    })
                }
                while (days.length) {
                    this.dates.push(days.splice(0, 7))
                }
            },

            showDetail(orderTimeInfo, day){

                this.currentDay = day
                this.currentShopName = orderTimeInfo['shop_name']
                let index = orderTimeInfo.shop_id + "-" + day
                let index_value = this.orderIndex.indexOf(index)
                if(index_value >= 0) {
                    this.currentData = this.orderTimes[index_value]
                    this.showModel = true
                    return
                }
                this.orderIndex.push(index)
                let queryDate = this.year + '-' + this.month + '-' + day
                let start_time = queryDate
                let end_time   = queryDate + " 23:59:59"
                getOrderTimeView({
                    shop_id: orderTimeInfo.shop_id,
                    start_time: start_time,
                    end_time: end_time
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.currentData = response.data
                        this.orderTimes.push(response.data)
                    }
                }).catch((error) => {
                    console.log(error)
                })
                this.showModel = true
            }
        },

    }
</script>

<style scoped>

    .calendar {
        border-collapse: collapse;
        max-width: 100%;
        background-color: transparent;
        width: 100%;
        border: 0;
        position: relative;
        table-layout: fixed;
        border-bottom: 1px solid #E7E9F1;
    }

    tbody tr {
        border-top: 1px solid #E7E9F1;
    }

    th,
    td {
        text-align: right;
        border: 0;
    }

    td:last-child {
        border-right: 1px solid #E7E9F1;
    }

    td:last-child,
    td:first-child {
        background-color: #F7F8FD;
    }

    caption {
        color: #333;
        font-weight: 500;
        font-size: 1.3em;
    }

    .calendar-head {
        line-height: 18px;
        padding: 0;
        text-align: right;
        padding-right: 12px;
        padding-bottom: 10px;
        font-weight: 400;
        color: #666;
        width: 14%;
    }

    .full-calendar-cell {
        position: relative;
        border-left: 1px solid #E7E9F1;
    }

    .full-calendar-date {
        text-align: left;
        display: block;
        color: #666;
        min-height: 116px;
        padding: 4px 8px;
        -webkit-transition: background .3s ease;
        transition: background .3s ease;
    }

    .full-calendar-date:hover {
        background: #eaf8fe;
        cursor: pointer;
    }

    .full-calendar-value {
        display: block;
        margin: 0 auto;
        color: #666;
        border-radius: 4px;
        width: auto;
        text-align: right;
        height: 22px;
        padding: 0;
        background: transparent;
        line-height: 22px;
        font-size: 15px;
    }
    .last-calendar-cell .full-calendar-value,
    .next-calendar-cell .full-calendar-value {
        color: #D6D9E2;
    }
    .full-calendar-today .full-calendar-value {
        background: #FE4D63;
        color: #FFF;
        display: inline-block;
        float: right;
        width: 22px;
        text-align: center;
        border-radius: 50%;
    }
    .events {
        line-height: 24px;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .full-calendar-content {
        height: 90px;
        overflow-y: auto;
        position: static;
        width: auto;
        left: auto;
        bottom: auto;
    }
    .events li {
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        background-color: rgba(255, 76, 76, .05);
        line-height: 1.5;
        margin: 3px 0;
    }
    .events li:before {
        content: '●';
        margin-right: 2px;
        color: #FE4D63;
    }
</style>
