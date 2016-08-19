'use strict';

// pushイベントのリスナーを用意。
self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  // サンプルでは固定のメッセージを通知するようにしています。
  // 動的にユーザーごとにメッセージを変えたい場合は、
  // ペイロードの暗号化を行うか、FetchAPIで動的に情報を取得する必要があります。
  // var title = '新着記事のお知らせです';
  // var body = 'テスト固定メッセージが表示されるはず';
  // var icon = 'logo.jpg';

  // var tag = 'simple-push-demo-notification-tag';
  // var url = 'https://webnewtype.com/';
  //
  // event.waitUntil(
  //   self.registration.showNotification(title, {
  //     body: body,
  //     icon: icon,
  //     tag: tag,
  //     data: {
  //       url: url
  //     }
  //   })
  // );

  event.waitUntil(
    fetch("/message.json", {
      credentials: "include"
    }).then(function(res){
      res.json().then(function(data){
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.image_path,
        });
      });
    })
  )

});

// プッシュ表示された際の窓をクリックした場合のイベントリスナー
self.addEventListener('notificationclick', function(event) {
  // console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  var notoficationURL = "/"
  if (event.notification.data.url) {
    notoficationURL = event.notification.data.url
  }

  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(notoficationURL);
    }
  }));

});
