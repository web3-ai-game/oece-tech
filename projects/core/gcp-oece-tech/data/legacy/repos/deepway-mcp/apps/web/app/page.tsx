export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-mycelium-50 to-mushroom-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-6 text-6xl font-bold text-mycelium-800 dark:text-mycelium-100">
            🍄 DeepWay.me
          </h1>
          <p className="mb-8 text-2xl text-mushroom-700 dark:text-mushroom-200">
            菌絲部落 - 真菌愛好者的交流天地
          </p>
          <p className="mb-12 text-lg text-gray-600 dark:text-gray-300">
            探索真菌的奇妙世界，分享栽培經驗，學習專業知識
          </p>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">💬</div>
              <h3 className="mb-2 text-xl font-semibold">社區論壇</h3>
              <p className="text-gray-600 dark:text-gray-400">
                與全球真菌愛好者交流討論
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">🛒</div>
              <h3 className="mb-2 text-xl font-semibold">商品聚合</h3>
              <p className="text-gray-600 dark:text-gray-400">
                精選優質菌種與栽培工具
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 text-xl font-semibold">教程中心</h3>
              <p className="text-gray-600 dark:text-gray-400">
                從入門到精通的完整教學
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <button className="rounded-lg bg-mycelium-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-mycelium-700">
              開始探索
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
