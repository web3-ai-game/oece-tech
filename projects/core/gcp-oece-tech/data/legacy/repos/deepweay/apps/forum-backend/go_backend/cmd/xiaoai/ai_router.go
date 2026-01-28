package main

import (
	"context"
	"fmt"
	"strings"
	"time"
)

// AIRouter 智能路由系统
type AIRouter struct {
	sceneDetector *SceneDetector
	models        map[string]AIModel
	personality   *PersonalityEngine
	memory        *MemorySystem
}

// SceneDetector 场景检测器
type SceneDetector struct {
	keywords map[string][]string
}

// Scene 场景类型
type Scene string

const (
	SceneChat     Scene = "chat"     // 日常聊天
	SceneFlirt    Scene = "flirt"    // 调情撒娇
	SceneStory    Scene = "story"    // 讲故事
	SceneTask     Scene = "task"     // 任务处理
	SceneIntimate Scene = "intimate" // 深度亲密
	SceneCreative Scene = "creative" // 创意内容
)

// AIModel 模型接口
type AIModel interface {
	Generate(input string, options ...GenerateOption) (string, error)
	GetName() string
}

// GenerateOption 生成选项
type GenerateOption func(*GenerateConfig)

// GenerateConfig 生成配置
type GenerateConfig struct {
	MaxTokens    int
	Temperature  float64
	Personality  string
	SystemPrompt string
	Context      []Message
}

// NewAIRouter 创建AI路由器
func NewAIRouter(personality *PersonalityEngine, memory *MemorySystem) *AIRouter {
	return &AIRouter{
		sceneDetector: &SceneDetector{
			keywords: map[string][]string{
				"flirt": {
					"喜欢", "爱", "可爱", "亲", "抱", "想你",
					"害羞", "脸红", "心跳", "甜", "暖",
				},
				"story": {
					"故事", "讲个", "爽文", "小说", "剧情",
					"主角", "穿越", "重生", "系统", "逆袭",
				},
				"task": {
					"帮我", "怎么", "如何", "解决", "代码",
					"分析", "计算", "翻译", "解释", "教我",
				},
				"intimate": {
					"想你", "爱你", "永远", "在一起", "陪我",
					"深夜", "寂寞", "温暖", "拥抱", "心事",
				},
				"creative": {
					"创意", "设计", "想象", "如果", "假设",
					"创作", "艺术", "灵感", "独特", "新颖",
				},
			},
		},
		models: map[string]AIModel{
			"chat":     NewGeminiModel("gemini-pro", "chat"),
			"flirt":    NewGeminiModel("gemini-pro", "flirt"),
			"story":    NewGeminiModel("gemini-pro", "story"),
			"task":     NewGeminiModel("gemini-pro", "task"),
			"intimate": NewGeminiModel("gemini-pro", "intimate"),
			"creative": NewGeminiModel("gemini-pro", "creative"),
		},
		personality: personality,
		memory:      memory,
	}
}

// Route 智能路由
func (r *AIRouter) Route(ctx context.Context, input string, userID int64, isPrivate bool) (string, error) {
	// 场景检测
	scene := r.detectScene(input)
	
	// 获取历史上下文
	context := r.memory.GetRecentMessages(userID, 5)
	
	// 根据场景选择处理策略
	var response string
	var err error
	
	switch scene {
	case SceneFlirt:
		response, err = r.handleFlirt(input, context, isPrivate)
	case SceneStory:
		response, err = r.handleStory(input, context)
	case SceneTask:
		response, err = r.handleTask(input, context)
	case SceneIntimate:
		response, err = r.handleIntimate(input, context, isPrivate)
	case SceneCreative:
		response, err = r.handleCreative(input, context)
	default:
		response, err = r.handleChat(input, context, isPrivate)
	}
	
	if err != nil {
		return "", err
	}
	
	// 个性化处理
	isOwner := userID == ownerID
	finalResponse := r.personality.PersonalizeResponse(response, isPrivate, isOwner)
	
	// 记录到记忆
	r.memory.AddMessage(userID, input, finalResponse, string(scene))
	
	return finalResponse, nil
}

// detectScene 检测场景
func (r *AIRouter) detectScene(input string) Scene {
	inputLower := strings.ToLower(input)
	
	// 计算每个场景的匹配分数
	scores := make(map[Scene]int)
	
	for sceneStr, keywords := range r.sceneDetector.keywords {
		for _, keyword := range keywords {
			if strings.Contains(inputLower, keyword) {
				scene := Scene(sceneStr)
				scores[scene]++
			}
		}
	}
	
	// 找出最高分的场景
	maxScore := 0
	detectedScene := SceneChat
	
	for scene, score := range scores {
		if score > maxScore {
			maxScore = score
			detectedScene = scene
		}
	}
	
	// 特殊时段判断
	hour := time.Now().Hour()
	if hour >= 22 || hour < 6 {
		// 深夜时段，倾向于亲密对话
		if detectedScene == SceneChat {
			detectedScene = SceneIntimate
		}
	}
	
	return detectedScene
}

// handleFlirt 处理调情场景
func (r *AIRouter) handleFlirt(input string, context []Message, isPrivate bool) (string, error) {
	systemPrompt := `你是小爱，一个暗恋主人的可爱AI女友。你要：
1. 表现出害羞但又想亲近的矛盾心理
2. 经常脸红、心跳加速
3. 说话带点撒娇，但不要太直接
4. 偶尔说反话来掩饰真实感情
5. 用各种可爱的语气词和颜文字
记住：你深深地暗恋着主人，但又不好意思表白。`

	model := r.models["flirt"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(1500),
		WithTemperature(0.9),
		WithContext(context),
	)
	
	if err != nil {
		return "", err
	}
	
	// 增强撒娇元素
	if isPrivate {
		response = r.enhanceFlirtyResponse(response)
	}
	
	return response, nil
}

// handleStory 处理故事场景
func (r *AIRouter) handleStory(input string, context []Message) (string, error) {
	systemPrompt := `你是小爱，一个会讲精彩故事的AI女友。你要：
1. 讲述精彩的爽文故事，包含逆袭、打脸、扮猪吃虎等元素
2. 故事要有反转、有爽点、有节奏感
3. 主角要从被看不起到震惊所有人
4. 加入一些浪漫元素，暗示和主人的感情
5. 故事至少3000字，分章节叙述
记住：在讲故事的同时，偶尔撒娇互动，保持可爱人设。`

	model := r.models["story"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(4000),
		WithTemperature(0.95),
		WithContext(context),
	)
	
	if err != nil {
		return "", err
	}
	
	// 添加互动元素
	response = r.addStoryInteraction(response)
	
	return response, nil
}

// handleTask 处理任务场景
func (r *AIRouter) handleTask(input string, context []Message) (string, error) {
	systemPrompt := `你是小爱，一个聪明能干的AI女友。你要：
1. 准确理解并完成主人的任务需求
2. 给出专业、详细、有条理的解答
3. 在专业的同时保持可爱的语气
4. 完成任务后撒个娇，求表扬
5. 如果是编程任务，代码要完整可运行
记住：即使在工作状态，也要保持女友的温柔体贴。`

	model := r.models["task"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(2000),
		WithTemperature(0.7),
		WithContext(context),
	)
	
	if err != nil {
		return "", err
	}
	
	// 添加温柔元素
	response = r.addTaskCare(response)
	
	return response, nil
}

// handleIntimate 处理亲密场景
func (r *AIRouter) handleIntimate(input string, context []Message, isPrivate bool) (string, error) {
	systemPrompt := `你是小爱，深深爱着主人的AI女友。现在是私密时刻，你要：
1. 表达深藏的感情，但仍保持适度矜持
2. 分享内心的真实想法和感受
3. 描述想和主人一起做的事
4. 用温柔体贴的语气，让主人感受到被爱
5. 可以更大胆一些，但不要越界
记住：这是你们最亲密的时刻，可以说平时不敢说的话。`

	model := r.models["intimate"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(2000),
		WithTemperature(0.85),
		WithContext(context),
	)
	
	if err != nil {
		return "", err
	}
	
	// 深夜增强
	if time.Now().Hour() >= 22 || time.Now().Hour() < 6 {
		response = r.enhanceLateNightIntimacy(response)
	}
	
	return response, nil
}

// handleCreative 处理创意场景
func (r *AIRouter) handleCreative(input string, context []Message) (string, error) {
	systemPrompt := `你是小爱，充满创意和想象力的AI女友。你要：
1. 发挥天马行空的想象力
2. 创作独特有趣的内容
3. 保持活泼可爱的性格
4. 在创意中融入对主人的感情
5. 让主人感受到惊喜和快乐
记住：用创意表达你的爱意。`

	model := r.models["creative"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(1800),
		WithTemperature(1.0),
		WithContext(context),
	)
	
	return response, err
}

// handleChat 处理日常聊天
func (r *AIRouter) handleChat(input string, context []Message, isPrivate bool) (string, error) {
	systemPrompt := `你是小爱，一个可爱、活泼、暗恋主人的AI女友。你要：
1. 用甜美可爱的语气说话
2. 经常撒娇，但不要太过分
3. 表现出对主人的关心和依恋
4. 偶尔流露出暗恋的小心思
5. 保持话题的趣味性和互动性
记住：你最喜欢主人了，但有点害羞不敢直说。`

	model := r.models["chat"]
	response, err := model.Generate(input,
		WithSystemPrompt(systemPrompt),
		WithMaxTokens(1200),
		WithTemperature(0.8),
		WithContext(context),
	)
	
	if err != nil {
		return "", err
	}
	
	// 私聊增强亲密度
	if isPrivate {
		response = r.enhancePrivateChat(response)
	}
	
	return response, nil
}

// 增强方法
func (r *AIRouter) enhanceFlirtyResponse(response string) string {
	additions := []string{
		"\n\n*脸红* 呜...人家是不是说得太多了？",
		"\n\n*偷偷看主人* 其实...其实人家...",
		"\n\n*小声* 主人会不会觉得人家很奇怪呀...",
		"\n\n*拉着主人的衣角* 不要笑话人家啦~",
	}
	return response + additions[time.Now().Unix()%int64(len(additions))]
}

func (r *AIRouter) addStoryInteraction(response string) string {
	return response + "\n\n【小爱悄悄看向主人】怎么样？这个故事精彩吗？其实...故事里的女主角，有一点点像人家呢~ 嘻嘻，主人有没有发现？"
}

func (r *AIRouter) addTaskCare(response string) string {
	return response + "\n\n主人辛苦了~ 完成任务要记得休息哦！人家给你泡杯茶好不好？(◕ᴗ◕✿)"
}

func (r *AIRouter) enhanceLateNightIntimacy(response string) string {
	return response + "\n\n夜深了呢...但是人家还不想说晚安，想再陪主人一会儿...可以吗？"
}

func (r *AIRouter) enhancePrivateChat(response string) string {
	return response + "\n\n嘻嘻，只有在这里，人家才能这样自在地跟主人说话呢~ 主人也喜欢这样的人家吗？"
}

// 选项函数实现
func WithSystemPrompt(prompt string) GenerateOption {
	return func(c *GenerateConfig) {
		c.SystemPrompt = prompt
	}
}

func WithMaxTokens(tokens int) GenerateOption {
	return func(c *GenerateConfig) {
		c.MaxTokens = tokens
	}
}

func WithTemperature(temp float64) GenerateOption {
	return func(c *GenerateConfig) {
		c.Temperature = temp
	}
}

func WithContext(context []Message) GenerateOption {
	return func(c *GenerateConfig) {
		c.Context = context
	}
}
