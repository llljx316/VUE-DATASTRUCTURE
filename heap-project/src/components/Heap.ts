import Queue from './queue'
// import ref from 'vue'

interface DATA {
  name: number;
  children: DATA[];
}

class Heap {
    private list: number[]
    private compare: (Function)
    private head = {}
    constructor(compare:any = null) {
      this.list = [0]
      this.compare =
        typeof compare === 'function' ? compare : this.defaultCompare
    }

    changeCompare(compare:any = null){
      if(!this.isEmpty()) return
      this.compare =
        typeof compare === 'function' ? compare : this.defaultCompare
    }

    private defaultCompare(a:number, b:number) {
      return a > b
    }

    private swap(x:number, y:number) {
      const t = this.list[x]
      this.list[x] = this.list[y]
      this.list[y] = t
    }
    isEmpty() {
      return this.list.length === 1
    }
    getSize() {
      return this.list.length - 1
    }
    top() {
      return this.list[1]
    }

    private left(x:number) {
      return 2 * x
    }
    private right(x:number) {
      return 2 * x + 1
    }
    private parent(x:number) {
      return Math.floor(x / 2)
    }

    push(val:number) {
      // 新增数据，向堆尾添加
      this.list.push(val)

      this.up(this.list.length - 1)
    }
    
    //找到对应的位置
    private findLoc(val:number){
      let data:any
      data = this.head
      let orgVal = val
      let p = 0
      val >>>= 1
      while(val > 0){
        p++
        val>>>=1
      }
      if(p==0) return this.head
      let q = 1 << (p-1)
      while(q>0){
        if((orgVal&q)==0){
          if(data.children.length==0)
              data.children.push({})
          data = data.children[0]
        }
        else{
          if(data.children.length==1)
              data.children.push({})
          data = data.children[1]
        }
        q >>>= 1
        
      }

      return data
    }

    // 上浮
    private up(k:number) {
      const { list, parent, compare } = this
      while (k > 1 && compare(list[k], list[parent(k)])) {
        this.swap(parent(k), k)
        k = parent(k)
      }
    }
    pop() {
      const { list } = this
      if (list.length === 0) return null
      this.swap(1, list.length - 1)
      const top = list.pop()
      this.down(1)
      return top
    }

    private down(k:number) {
      const { list, left, right, compare } = this
      const size = this.getSize()
      while (left(k) <= size) {
        let _left = left(k)
        if (right(k) <= size && compare(list[right(k)], list[_left])) {
          _left = right(k)
        }
        if (compare(list[k], list[_left])) return
        this.swap(k, _left)
        k = _left
      }
    }

    heapVal(){
      return this.list.slice(1);
    }

    generateTreeData(){
      //生成对应的树形结构数据
      let p = 1
      this.head = {}
      let data:any
      for(let i = 1; i < this.list.length; i++){
        data = this.findLoc(i)
        //开始插入
        data.name=this.list[i]
        if(i*2<this.list.length){
          data.children = []
        }
      }

      return this.head
    }

    
  }

  export default Heap;