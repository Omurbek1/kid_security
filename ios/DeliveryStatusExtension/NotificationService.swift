//
//  NotificationService.swift
//  DeliveryStatusExtension
//
//  Created by Ilia Yurasov on 21/06/2019.
//  Copyright © 2019 650 Industries, Inc. All rights reserved.
//

import UserNotifications

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        if let bestAttemptContent = bestAttemptContent {
            // Modify the notification content here...
            if let kind: String = bestAttemptContent.userInfo["kind"] as? String {
                if ("TEXT_MESSAGE" == kind || "VOICE_MAIL" == kind) {
                    if let mailId = bestAttemptContent.userInfo["mailId"] as? Int {
                        if let objectId = bestAttemptContent.userInfo["objectId"] as? Int {
                            let url = sendDeliveryInformation(username: "demo", objectId: objectId, mailId: mailId)
                            //bestAttemptContent.body = "\(bestAttemptContent.body) \(url)"
                            //bestAttemptContent.title = "\(bestAttemptContent.title) \(kind) \(objectId) \(mailId)"
                        }
                    }
                }
            }
            
            //bestAttemptContent.title = "\(bestAttemptContent.title) [m]"
            contentHandler(bestAttemptContent)
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
    
    func sendDeliveryInformation(username: String, objectId: Int, mailId: Int) -> String {
        let URL_DELIVERED = "https://server.kidsecurity.tech/messagedelivered/"
        
        let data = (username).data(using: String.Encoding.utf8)
        let base64 = data!.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
        
        let url = URL_DELIVERED + base64 + "/" + String(objectId) + "/" + String(mailId)
        //print(" ===== \(url)")
        
        let sender = HttpSender()
        sender.send(url: url, callback: { (reply, status, error) in
            /*print(" === \(reply)")
            print(" === \(status)")
            print(" === \(error)")*/
        })
        
        return url
    }
    
}
