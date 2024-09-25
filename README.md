# vanity-spl-token-mint

生成虚荣 token 的 mint 地址，即指定 前缀和后缀, 例如: 生成指定前缀`nice`的地址

指定的前缀或后缀的长度越长，生成难度越大，生成时间呈指数上升

建议：
- `前缀`字符数+`后缀`字符数不要超过 `3`


具体流程图:

![](https://raw.githubusercontent.com/youngqqcn/repo4picgo/master/img/vanity_address2.png)



## Typescript版本


源码: [create-token-mint-vanity.ts](./create-token-mint-vanity.ts)

运行:

```
yarn

yarn start
```


## Go版本

源码: [main.go](./main.go)

```
go mod tidy

go run main.go
```


## 关于虚荣地址生成
- 方案1：服务端可以预生成一批虚荣地址，存放在数据库中备用
- ~~方案2（不推荐）：临时生成，非常消耗CPU资源~~