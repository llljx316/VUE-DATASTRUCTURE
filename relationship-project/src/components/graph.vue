<template>
    <div id="chart-container" class="border-item" style="height: 98%; margin-top: 2px;"></div>
</template>

<script setup lang="ts">
    import * as echarts from 'echarts';
    import * as jq from 'jQuery';
    import { onMounted } from 'vue';

    interface GraphNode {
    symbolSize: number;
    label?: {
        show?: boolean;
    };
    }

    onMounted(()=>{
        init_chart()
    })

    let myChart: any

    function init_chart(){
        const chartContainer = document.getElementById('chart-container');
        myChart = echarts.init(chartContainer);
        // let ROOT_DIR='D:\\homeworks\\VUE-DATASTRUCTURE\\relationship-project\\src\\components'
        change_chart()
    }

    function change_chart(){
        jq.getJSON('src\\components\\miserables.json', function (graph) {
        myChart.hideLoading();
        let option:any

        graph.nodes.forEach(function (node: GraphNode) {
            node.label = {
            show: node.symbolSize > 30
            };
        });

        let gname = '总关系图'
        const categories=[
            [
                '个人',
                '普通群组',
                '小学',
                '初中',
                '高中',
                '大学',
                
            ],
            [
                '中心',
                '一级组织',
                '二级组织',
                '一级好友',
                '二级好友'
            ],
        ]

        option = {
            title: {
            text: gname,
            subtext: 'Circular layout',
            top: 'bottom',
            left: 'right'
            },
            tooltip: {},
            legend: [
            {
                data: categories[0].map(function (a: string) {
                return a;
                })
            }
            ],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
            {
                name: gname,
                type: 'graph',
                layout: 'circular',
                circular: {
                rotateLabel: true
                },
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                position: 'right',
                formatter: '{b}'
                },
                lineStyle: {
                color: 'source',
                curveness: 0.3
                }
            }
            ]
        };

        myChart.setOption(option);
        window.onresize = myChart.resize;
        });
    }

    


</script>