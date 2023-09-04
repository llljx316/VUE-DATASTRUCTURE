<template>
<el-container class="parent-container">
  <el-header>堆排序</el-header>

  <el-main>
    <el-row>
    <el-col :span="12">
      <div>
        <el-row>
          <el-col :span="24">
            <div id="chart-container" style="height: 500px; width:auto"></div>
          </el-col>
        </el-row>
          
        <el-row>
          <el-input placeholder="请输入数组" v-model="inputArray" clearable></el-input>
        </el-row>

        <el-row>
          <el-col :span="6"><el-switch v-model="typeOfHeap" :disabled="disabledChangeHeap" active-text="大根堆" inactive-text="小根堆" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
          <el-col :span="18">
          <!-- <el-button-group size="medium" > -->
            <el-button class="buttons" type="primary" @click="heapify" >建立堆</el-button>
          
            <el-button class="buttons" type="primary" @click="pop">弹出元素</el-button>
            
            <el-button class="buttons" type="primary" @click="clear">清空堆</el-button>
            <el-button class="buttons" type="primary" @click="sortALL">堆排序</el-button>
        
          <!-- </el-button-group> -->
        </el-col>
          <!-- <el-col :span="3"><el-button type="primary" @click="heapify" >Build Heap</el-button></el-col>
          <el-col :span="3" :offset="1"><el-button type="primary" @click="pop">Pop</el-button></el-col>
          <el-col :span="3" :offset="1"><el-button type="primary" @click="clear">Clear Heap</el-button></el-col>
          <el-col :span="3" :offset="1"><el-button type="primary" @click="sortALL">Sort Heap</el-button></el-col> -->
        </el-row>
      </div>
    </el-col>
    <el-col :span="11" :offset="1">
      <el-row  class="content-container"  align="middle">
        <el-col>
        <el-row>
          当前堆:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
          <span v-for="n in heapArray">{{`${n}&nbsp;`}} </span>
          <!-- {{ array }} -->
        </el-row>
        <el-row>
          堆顶元素:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{peek}}
        </el-row>

        <el-row>
          排序后的结果:&nbsp;
          <span v-for="n in sortedArray">{{`${n}&nbsp;`}} </span>
        </el-row>
      </el-col>
      </el-row>

    </el-col>
    </el-row>
  </el-main>

  <el-footer>Footer</el-footer>
</el-container>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount, handleError } from 'vue'
  import Heap from './components/Heap'
  import * as echarts from 'echarts';


  

  let heap=new Heap()
  // const minValue = ref<number | null>(null);

  const inputArray = ref<string>('')
  const array = ref<number[]>([])
  const heapArray = ref<number[]>([])
  const sortedArray = ref<number[]>([])
  const typeOfHeap = ref<boolean>(true)
  const disabledChangeHeap =ref<boolean>(false)
  

  const peek = ref<number|null>()
   // 获取容器元素
  
  //图表
  let chart:echarts.ECharts
  let data:any
  let options:any
  // 基于容器元素创建ECharts实例
  let screenWidth :number
  let screenHeight :number


  onMounted(() => {
    //配置页面长宽
    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        screenWidth = document.body.clientWidth;
        screenHeight = document.body.clientHeight;
      })();
    };


    // 定义图表配置项和数据
    data = {}
    options = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          label: {
            position: 'top',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 15
          },

          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          initialTreeDepth: undefined,
          animationDurationUpdate: 750
        }
      ]
    };


    // 使用配置项绘制图表
    const chartContainer = document.getElementById('chart-container');
    chart = echarts.init(chartContainer);
    chart.setOption(options);
    
    // updateTree()
  }
  )

  onBeforeUnmount(() => {
    // 销毁图表
    chart.dispose();
  });

  function updateTree(){
    // const chartContainer = document.getElementById('chart-container');
    // 定义图表配置项和数据
    data = heap.generateTreeData()
    options = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          label: {
            position: 'top',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 15
          },

          leaves: {
            label: {
              position: 'top',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'right'
            }
          },

          animationDurationUpdate: 750
        }
      ]
    };


    // 使用配置项绘制图表
    // const chartContainer = document.getElementById('chart-container');
    // chart = echarts.init(chartContainer);
    chart.setOption(options);
    if(heap.isEmpty()){
      disabledChangeHeap.value = false
    }
    
  }

  function littleCompare(a:any,b:any){
    return a < b
  }


  function heapify() {
    // if(heap==undefined||!heap.isEmpty())
    //   heap = new Heap(typeOfHeap.value?null:littleCompare)
    while(!heap.isEmpty()){
      heap.pop()
    }
    heapArray.value = heap.heapVal()
    typeOfHeap.value?heap.changeCompare():heap.changeCompare(littleCompare)
    sortedArray.value = []
    add()
    disabledChangeHeap.value = true
  }  

  function clear(){
    while(!heap.isEmpty()){
      heap.pop()
    }
    sortedArray.value = []
    heapArray.value = heap.heapVal()
    peekUpdate()
    // disabledChangeHeap.value = false
  }

  function add(){
    // 建堆逻辑
    array.value = inputArray.value.split(' ').map((n) => Number(n))
    for(let i of array.value) {
      heap.push(i)
    }
    heapArray.value = heap.heapVal()
    //sort()
    peekUpdate()
    data = heap.generateTreeData()

  }


  function peekUpdate(){
    peek.value = heap.top()
    updateTree()

  }

  function pop(){
    if(heap.top()!=null){
      sortedArray.value.push(heap.top())
      heap.pop()
      heapArray.value = heap.heapVal()
      peekUpdate()
    }

    
  }

  function sleep(ms:number){
    return new Promise((resolve)=>setTimeout(resolve,ms));
  }

  //同步和异步要声明
  async function sortALL(){
    let tm=0;
    while(!heap.isEmpty()){
      pop();
      await sleep(750)
    }
  } 
</script>

<style>
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 60px;
    font-size: larger;
  }

  .el-main {
    background-color: #e9eef3;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 10px;
    min-width: 1300px;
    min-height: 600px;
  }


  .el-row{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    
  }

  .el-col{
    border-radius: 4px;
  }

  .parent-container{
    /* height: 100px; */
  }



  #chart-container {
    /* width: 100%;
    height: 400px; */
    border:2px solid #000;
    border-radius: 10px;
    background-color: aliceblue;
  }

    .buttons{
      width: 20%;
    }
  
  .content-container{
    min-height: 500px;
    font-size: larger;
  }

  /* #content-container:{
    width:500px;
  } */

  
</style>