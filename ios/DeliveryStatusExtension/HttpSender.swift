//
//  HttpSender.swift
//  DeliveryStatusExtension
//
//  Created by Ilia Yurasov on 22/06/2019.
//  Copyright © 2019 650 Industries, Inc. All rights reserved.
//

import Foundation

class HttpSender {
    
    static var queue: OperationQueue {
        let q = OperationQueue()
        q.qualityOfService = .utility
        q.maxConcurrentOperationCount = 1
        return q;
    }
    
    func send(url: String, callback: @escaping (_ reply: String?, _ status: Int?, _ error: Any?) -> Void) {
        let url = URL(string: url)
        
        var request = URLRequest(url: url!)
        request.httpMethod = "GET"
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 60
        configuration.timeoutIntervalForResource = 60
        configuration.allowsCellularAccess = true
        configuration.httpMaximumConnectionsPerHost = 100
        if #available(iOS 11.0, *) {
            configuration.waitsForConnectivity = true
        } else {
            // Fallback on earlier versions
        }
        
        let session = URLSession(configuration: configuration)
        let task = session.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            let reply = nil == data ? nil : String(data: data!, encoding: .utf8)
            var statusCode: Int? = nil
            if let httpResponse = response as? HTTPURLResponse {
                statusCode = httpResponse.statusCode
            }
            session.invalidateAndCancel()
            callback(reply, statusCode, error)
        })
        task.resume()
    }
}
