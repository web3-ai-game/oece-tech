# 密码学：数字世界的守护者

## 第一章：古典密码学入门

### 为什么学习密码学？

在数字世界中，密码学就像是一把万能钥匙。掌握了它，你就能：

- 保护自己的隐私
- 理解互联网的安全机制
- 建立真正安全的通信
- 成为数字世界的"守护者"

### 从凯撒密码开始

最简单的加密方法：字母位移

```python
# 凯撒密码示例
def caesar_cipher(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = 65 if char.isupper() else 97
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
        else:
            result += char
    return result

# 加密
plaintext = "HELLO WORLD"
ciphertext = caesar_cipher(plaintext, 3)
print(f"明文: {plaintext}")
print(f"密文: {ciphertext}")  # KHOOR ZRUOG
```

### 破解凯撒密码

既然能加密，就能解密：

```python
# 暴力破解
def brute_force_caesar(ciphertext):
    for shift in range(26):
        decrypted = caesar_cipher(ciphertext, -shift)
        print(f"Shift {shift}: {decrypted}")

# 尝试所有可能
brute_force_caesar("KHOOR ZRUOG")
```

### 维吉尼亚密码

更强的多字母替换密码：

```python
def vigenere_encrypt(plaintext, key):
    result = []
    key = key.upper()
    key_index = 0
    
    for char in plaintext.upper():
        if char.isalpha():
            shift = ord(key[key_index % len(key)]) - ord('A')
            encrypted_char = chr((ord(char) - ord('A') + shift) % 26 + ord('A'))
            result.append(encrypted_char)
            key_index += 1
        else:
            result.append(char)
    
    return ''.join(result)
```

### 实战练习

1. **练习1**：编写一个程序，自动检测并破解凯撒密码
2. **练习2**：实现维吉尼亚密码的解密函数
3. **练习3**：分析为什么古典密码不再安全

### 下一步

掌握了古典密码学，你已经理解了加密的基本原理。下一章，我们将进入现代密码学的世界，学习真正安全的加密算法。

---

**关键概念**：
- 明文 (Plaintext)：原始信息
- 密文 (Ciphertext)：加密后的信息
- 密钥 (Key)：加密/解密的关键
- 算法 (Algorithm)：加密的方法

**继续探索**：[第二章：对称加密](./02-symmetric.md)
