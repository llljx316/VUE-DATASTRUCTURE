<template>
    <div id="chart-container" class="border-item" style="height: 98%; margin-top: 2px;"></div>
</template>



<script setup lang="ts">
    import * as echarts from 'echarts';
    import * as jq from 'jQuery';
    import { computed, onMounted, watch } from 'vue';
    import { allNM, __activePartGraph,__partGraphCenter } from './sharedArguements';
    import { NodeBase, NodeTag } from './dataStructure/NodeBase';
    import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
import HashTable from './dataStructure/HashTable';

    function deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

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
        myChart.hideLoading();

        // let ROOT_DIR='D:\\homeworks\\VUE-DATASTRUCTURE\\relationship-project\\src\\components'
        changeMainChart()
        window.onresize = myChart.resize;

    }

    class NodeDisplay{
        name:String = ''
        category: number = 0
        id:string = ''
        symbolSize:number = 60

        constructor(name: String, catagory: number = 0, id: number = -1, symbolSize=60) {
            this.name = name
            this.category = catagory
            this.id = id.toString()
        }
    }

    class Link{
        source: string
        target: string

        constructor(source: number, target: number) {
            this.source = source.toString()
            this.target = target.toString()
        }
    }

    /**
     * 求枚举的数字值函数
     */
    function enumTagToNum(t:NodeTag){
        let cate = 0
        switch(t){
            case NodeTag.PERSON:
                cate = 1
                break
            case NodeTag.GROUP:
                cate = 2
                break
            case NodeTag.PRIMARY_SCHOOL:
                cate = 3
                break
            case NodeTag.JUNIOR_HIGH:
                cate = 4
                break
            case NodeTag.SENIOR_HIGH:
                cate = 5
                break
            case NodeTag.UNIVERSITY:
                cate = 6
                break
            default:
                cate = 0;
                break                
        }
        return cate
    }

    /**
     * 创建更改设置后的主要图表图表
     */

     const categories=[
            [
                {name:'无'},
                {name:'个人'},
                {name:'普通群组'},
                {name:'小学'},
                {name:'初中'},
                {name:'高中'},
                {name:'大学'},
                
            ],
            [
                {name:'中心'},
                {name:'一级组织'},
                {name:'二级组织'},
                {name:'一级好友'},
                {name:'二级好友'}
            ],
        ]
    function changeMainChart(){
        //建立catagory
        const NodesDis = new Array<NodeDisplay>()
        const Links = new Array<Link>()
        allNM.nodes.forEach((node_id,node)=>{
            let cate = enumTagToNum(node.tag)
            const newNode = new NodeDisplay(node.name, cate, node.id)
            NodesDis.push(newNode)

            //建立links
            node.relations.forEach((friendNode)=>{
                if(friendNode.id > node.id){
                    Links.push(new Link(node.id, friendNode.id))//画图单向即可
                }
            })
        })
        


        
        let option:any

        // graph.nodes.forEach(function (node: GraphNode) {
        //     node.label = {
        //     show: node.symbolSize > 30
        //     };
        // });

        let gname = '总关系图'
        

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
                data: categories[0].map(function (a:any) {
                    return a.name
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
                data: NodesDis,
                links: Links,
                categories: categories[0],
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
        
    }

    /**
     * 生成对应的类别值
     * @param node 节点
     * @param level 0或1级还是2级
     * @returns:number 返回对应类别的数字
     */
    function getCatePart(node:NodeBase, level:number){
        if(level==0)
            return 0;
        else if(node.tag == NodeTag.PERSON)
            return (2+level);
        else
            return level;
    }

    function changePartChart(){
        //建立part的data与category
        //建立catagory
        const NodesDisHash = new HashTable<number,NodeDisplay>()
        const Links = new Array<Link>()
        //先生成对应的零级节点
        NodesDisHash.put(__partGraphCenter.value.id, new NodeDisplay(
            __partGraphCenter.value.name,
            getCatePart(__partGraphCenter.value, 0),
            __partGraphCenter.value.id
        ))
        //一级节点
        __partGraphCenter.value.relations.forEach((node:NodeBase)=>{
            NodesDisHash.put(node.id, new NodeDisplay(
                node.name,
                getCatePart(node, 1),
                node.id
            ))
            //加入relation
            Links.push(new Link(__partGraphCenter.value.id, node.id))
        })
        //二级节点
        __partGraphCenter.value.relations.forEach((nodeOne:NodeBase) =>{
            nodeOne.relations.forEach((nodeTwo:NodeBase)=>{
                if(nodeTwo.id!=__partGraphCenter.value.id){
                    if(NodesDisHash.get(nodeTwo.id) == undefined){
                        NodesDisHash.put(nodeTwo.id, new NodeDisplay(
                            nodeTwo.name,
                            getCatePart(nodeTwo, 2),
                            nodeTwo.id
                        ))
                    }
                    //加入relation
                    Links.push(new Link(nodeOne.id, nodeTwo.id))
                }
                
            })
        })
        


        
        let option:any

        let gname = '总关系图'
        

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
                data: categories[0].map(function (a:any) {
                    return a.name
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
                data: NodesDis,
                links: Links,
                categories: categories[0],
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
    }

    //监听保证实时更新
    watch({allNM, __activePartGraph, __partGraphCenter},(newValue,oldValue)=>{
        if(__activePartGraph.value == false)
            changeMainChart()
        else
            changePartChart()
    })

    


</script>

<script lang="ts">

</script>