---
distilled_by: grok-4-0709
mode: B
---
part: 8
---

## 8. 代碼範例
以下提供 6 個帶註釋的代碼範例。

8.1 **Stimulus 控制器範例**  
```javascript
// app/javascript/controllers/hello_controller.js
import { Controller } from "@hotwired/stimulus"

// 連接時觸發，綁定事件
export default class extends Controller {
  connect() {
    console.log("Hello, Stimulus!")
  }
}
```

8.2 **Turbo Frame 使用**  
```html
<!-- app/views/posts/index.html.erb -->
<turbo-frame id="posts">  <!-- 定義 frame ID -->
  <%= render @posts %>    <!-- 伺服器渲染內容 -->
</turbo-frame>
```

8.3 **ActionCable 聊天**  
```ruby
# app/channels/chat_channel.rb
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_#{params[:room]}"  # 訂閱特定頻道
  end
end
```

8.4 **Sidekiq 任務**  
```ruby
# app/jobs/send_email_job.rb
class SendEmailJob < ApplicationJob
  queue_as :default

  def perform(user)  # 異步發送郵件
    UserMailer.welcome(user).deliver_now
  end
end
```

8.5 **RSpec 測試**  
```ruby
# spec/models/user_spec.rb
RSpec.describe User, type: :model do
  it "has valid email" do  # 測試驗證
    user = User.new(email: "test@example.com")
    expect(user).to be_valid
  end
end
```

8.6 **Stripe Webhook**  
```ruby
# app/controllers/stripe_webhook_controller.rb
class StripeWebhookController < ApplicationController
  skip_before_action :verify_authenticity_token  # 跳過 CSRF 檢查

  def create
    event = Stripe::Webhook.construct_event(payload, sig_header)  # 構建事件
    # 處理支付成功
  end
end
```
