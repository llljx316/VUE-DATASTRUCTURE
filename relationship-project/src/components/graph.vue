<template>
    <div id="chart-container" class="border-item" style="height: 95%; margin-top: 1%; background-color: white;"></div>
</template>



<script setup lang="ts">
    import * as echarts from 'echarts';
    import * as jq from 'jQuery';
    import { ref, onMounted, watch, type Ref } from 'vue';
    import { allNM, __activePartGraph,__partGraphCenter, NodesDisHash, personStorage, friendCanMade, friendNow, groupNow, friendRecommend, groupRecommend } from './sharedArguements';
    import { NodeBase, NodeTag } from './dataStructure/NodeBase';
    import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
import HashTable from './dataStructure/HashTable';
import { PersonNode } from './dataStructure/PersonNode';
import { GroupNode } from './dataStructure/GroupNode';

    

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

    /**
     * 生成对应的option
     * @param 
     * 
     * @returns options
     */
     function getOption(name:string, data:any, links:any, category:any){
        return {
            title: {
            text: name,
            subtext: 'Circular layout',
            top: 'bottom',
            left: 'right'
            },
            tooltip: {},
            legend: [
            {
                data: category.map(function (a:any) {
                    return a.name
                })
            }
            ],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
            {
                name: name,
                type: 'graph',
                layout: 'circular',
                circular: {
                rotateLabel: true
                },
                data: data,
                links: links,
                categories: category,
                label:{
                    show: true,
                    // position: "bottom",
                    distance: 20,
                    fontSize: 18,
                    align: "center",
                },
                lineStyle: {
                    color: 'black',
                    curveness: 0.3
                },
                roam: true,
                
            }
            ],
            
        };
    }


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
        
        option = getOption(gname, NodesDis, Links, categories[0])
        

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
        // const NodesDisHash = new HashTable<number,NodeDisplay>()
        if(allNM.getNodeById(__partGraphCenter.value.id) == undefined){
            __activePartGraph.value = false
            return
        }

        NodesDisHash.clear()
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
        //生成可以交的朋友
        friendCanMade.value = []
        

        personStorage.value.forEach((node) =>{
            //如果找不到，就加入
            if(NodesDisHash.get(node.id)==undefined){
                friendCanMade.value.push(node)
            }
        })

        //生成现有的朋友
        friendNow.value = []
        groupNow.value = []
        NodesDisHash.forEachSimple((node: NodeDisplay) => {
            if(node.id!=__partGraphCenter.value.id.toString()){
                if(node.category == 3)
                    friendNow.value.push(allNM.getNodeById(parseInt(node.id)))
                else
                    groupNow.value.push(allNM.getNodeById(parseInt(node.id)))
            }
        })
        

        //二级节点
        //生成二级朋友数组
        getSecondLevelFriend(NodesDisHash, __partGraphCenter, friendRecommend,groupRecommend)

        __partGraphCenter.value.relations.forEach((nodeOne:NodeBase) =>{
            nodeOne.relations.forEach((nodeTwo:NodeBase)=>{
                //加入relation
                //检查
                //可以优化
                if(nodeTwo.id!=__partGraphCenter.value.id)
                    if(nodeOne.id > nodeTwo.id ||NodesDisHash.get(nodeTwo.id) == undefined)
                        Links.push(new Link(nodeOne.id, nodeTwo.id))
            })
        })

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
                }
                
            })
        })
        
        //转换为数组
        const NodeDis = new Array<NodeDisplay>()
        NodesDisHash.forEachSimple((node:NodeDisplay)=>{
            NodeDis.push(node)
        })
        

        let option = getOption('局部关系图', NodeDis, Links, categories[1])
        myChart.setOption(option);
    }

    /**
     * 更新二级朋友的函数
     * @alias 建立一级的哈希表之后
     * @param HashMap<Disp> 哈希表，用于检查是否已经是朋友
     * @param centerEle 中心节点
     * @param FriendRecommend 二级朋友的数组
     * 改变friendRecommend的值
     */
    function getSecondLevelFriend(HashMap:HashTable<any,any>, centerEle:Ref<NodeBase>, FriendRecommend:Ref<any[]>, GroupRecommend:Ref<any[]>){
        //清空
        FriendRecommend.value = []
        GroupRecommend.value = []
        //新建一个哈希表(二级)
        const HashMap2 = new HashTable<any,NodeDisplay>()
        
        centerEle.value.relations.forEach((nodeOne:any) =>{
            nodeOne.relations.forEach((nodeTwo:NodeBase)=>{
                if(nodeTwo.id!=centerEle.value.id){
                    if(HashMap.get(nodeTwo.id) == undefined){
                        //当前节点提供的分数
                        const nowScore = nodeOne.tag==NodeTag.PERSON?0.8:nodeOne.relationCoefficient;
                        //检查是否在节点内
                        let ins:any = HashMap2.get(nodeTwo.id)
                        if(ins == undefined){
                            //还不在二级关系里
                            ins = {node:nodeTwo, score: 0}
                            if(nodeTwo.tag == NodeTag.PERSON){
                                FriendRecommend.value.push(ins)
                            }
                            else{
                                GroupRecommend.value.push(ins)
                            }
                            //插入哈希
                            HashMap2.put(nodeTwo.id,ins)
                        }
                        ins.score+=nowScore
                    
                }
            }})
        })

        //排序
        FriendRecommend.value.sort((a,b) => b.score-a.score)
        GroupRecommend.value.sort((a,b) => b.score-a.score)
    }

    //监听保证实时更新
    watch([()=>allNM, ()=>__activePartGraph.value, ()=>__partGraphCenter.value],(newValue,oldValue)=>{
        if(__activePartGraph.value == false)
            changeMainChart()
        else
            changePartChart()
        
        window.onresize = myChart.resize;
    },{deep:true})
    
    

    


</script>

<style>
    
</style>