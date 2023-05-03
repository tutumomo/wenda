// ==UserScript==
// @name         闻达 Auto 示例：QQ机器人Auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  
// @author       lyyyyy
// @match        http://127.0.0.1:17860/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @run-at document-idle
// @grant        none
// ==/UserScript==
//配置参考:https://drincann.github.io/Mirai-js/#/v2.x/Preparation
script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/mirai-js/dist/browser/mirai-js.js";
my_account = 2323662503
QQ_bot_chatting = async s => {
    s=s.trim()
    if (s.startsWith("zsk")) {
        cmd = s.split(" ")
            if (cmd[1] == 'on') {
                zsk(true)
                return "知识库开启"
            }
            if (cmd[1] == 'off') {
                zsk(false)
                return "知识库关闭"
        }
    }
    return await send(s)
}
script.onload = async () => {
    alert("QQ机器人Auto：载入")
    const { Bot, Message } = window.miraiJs;
    bot = new Bot();
    await bot.open({
        baseUrl: 'http://127.0.0.1:8080',
        verifyKey: 'INITKEYzLf3hb8p',
        qq: 2323662503,
    });
    bot.on('FriendMessage', async data => {
        console.log(data)
        data.messageChain.forEach(async element => {
            if (element.type == "Plain") {
                await bot.sendMessage({
                    friend: data.sender.id,
                    message: new Message().addText(await QQ_bot_chatting(element.text)),
                })

            }
        })
    });
    bot.on('GroupMessage', async data => {
        replay = false
        console.log(data)
        data.messageChain.forEach(async element => {
            if (element.type == "At" && element.target == my_account) {
                replay = true

            }
            if (replay && element.type == "Plain") {
                await bot.sendMessage({
                    group: data.sender.group.id,
                    message: new Message().addText(data.sender.memberName + ": " + await QQ_bot_chatting(element.text)),
                })

            }
        })
        // switch (data.sender.permission) {
        //     case Bot.groupPermission.OWNER:
        //         // 群主
        //         break;
        //     case Bot.groupPermission.ADMINISTRATOR:
        //         // 管理员
        //         break;
        //     case Bot.groupPermission.MEMBER:
        //         // 普通群成员
        //         break;
        // }
    });
}
document.body.append(script);