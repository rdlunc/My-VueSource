/**
 * 相当于Vue的构造函数
 * @param options
 * @constructor
 */
function MVVM(options) {
    //将配置对象保存到vm
    this.$options = options;
    //将data对象保存到vm和变量data中
    var data = this._data = this.$options.data;
    //保存vm到变量me
    var me = this;

    //遍历data中所有的属性
    Object.keys(data).forEach(function(key) { //key是data的某个属性名：name
        //对指定的属性实现代理
        me._proxy(key);
    });

    observe(data, this);

    //创建一个编译对象，作用是编译解析模版
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },

    /**
     * 实现指定属性代理的方法
     * @param key
     * @private
     */
    _proxy: function(key) {
        //保存vm
        var me = this;
        //给vm添加指定属性名的属性（使用的是属性描述符）
        Object.defineProperty(me, key, {
            configurable: false, //不能重新定义
            enumerable: true, //可以枚举遍历
            //当通过vm.xxx读取属性值时调用，从data中获取对应的属性值返回 【代理读操作】
            get: function proxyGetter() {
                return me._data[key];
            },
            //当通过vm.xxx = value 时，value被保存到data中对应的属性上 【代理写操作】
            set: function proxySetter(newVal) {
                me._data[key] = newVal;
            }
        });
    }
};