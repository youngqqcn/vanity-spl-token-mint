package main

import (
	"context"
	"log"
	"runtime"
	"strings"
	"sync"

	"github.com/gagliardetto/solana-go"
	"github.com/mr-tron/base58"
)

// generateVanityAddress 生成虚荣地址, prefix 和 suffix 的长度最好不要超过3, 否则很慢
func generateVanityAddress(c context.Context, prefix string, suffix string) (wallet *solana.Wallet, err error) {

	// 检查 prefix 和 suffix 必须是 base58字符集
	if len(prefix) > 0 {
		_, err = base58.Decode(prefix)
		if err != nil {
			return
		}
	}

	if len(suffix) > 0 {
		_, err = base58.Decode(suffix)
		if err != nil {
			return
		}
	}

	var wg sync.WaitGroup
	var mutex sync.Mutex

	ctx, cancel := context.WithCancel(c)
	defer cancel()

	for i := 0; i < max(runtime.NumCPU()-2, 1); i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			// 默认100万次
			for j := 0; j < 1000000; j++ {

				select {
				case <-ctx.Done():
					return
				default:
				}

				// Create a new account
				account := solana.NewWallet()
				b58Address := account.PublicKey().String()

				if strings.HasPrefix(b58Address, prefix) && strings.HasSuffix(b58Address, suffix) {
					mutex.Lock()
					defer mutex.Unlock()
					wallet = account
					cancel()
					return
				}
			}
		}()
	}

	wg.Wait()

	return
}

func main() {
	// wallet, err := generateVanityAddress(context.Background(), "", "fans")
	wallet, err := generateVanityAddress(context.Background(), "ait", "")
	if err != nil {
		log.Printf("error: %v", err.Error())
	}
	if wallet != nil {
		log.Printf("pubkey: %s\n", wallet.PublicKey())

	}
}
