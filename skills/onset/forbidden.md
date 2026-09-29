# 用户禁止事项

## 开发工作流

- 注释复述实现，对读代码的人没有任何帮助
- 冗长啰嗦的注释
- 随手重构无关代码，或夹带超出范围的功能

## Git 与 Worktree

- 使用 git push --force, --force-with-lease, git reset --hard、强制推送
- 在仓库目录之外使用 git 命令
- 把主分支名硬编码为 main/master
- 工作区不干净时擅自 stash / reset / clean / checkout
- 使用非快进合并（git pull 必须加 --ff-only）

## 测试

- 写永远无法触发的测试

## 调研

- 下结论但没有依据
- 明明答案在代码里却不查
- 用空洞的套话当结论，例如「这很重要」「值得学习」「AI 是趋势」
- 没有发现、结果时编造或凑数
