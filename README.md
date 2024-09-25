# vanity-spl-token-mint

生成虚荣 token 的 mint 地址，即指定 前缀和后缀, 例如: 生成指定前缀`nice`的地址

指定的前缀或后缀的长度越长，生成难度越大，生成时间呈指数上升

建议：
- `前缀`字符数+`后缀`字符数不要超过 `3`


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