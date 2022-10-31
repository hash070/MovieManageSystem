package com.guico.moviemanagesystembackend.utils;


import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class MailSend {
    //    static String to  ="1305487489@qq.com";
    static String to = "klyyds@qq.com";
    //    static String from = "a1305487489@163.com";
    static String from = "hash070@zzuli.top";
    //    static String host = "smtp.163.com";
    static String host = "mail.zzuli.top";
    //    static String password = "RRSZFYXHBIZEWYJG";
    static String password = "hHdUYkS7BAyeSmCJspjf";

    static final int port = 465;


    public static String doSend(String toMail) {
        try {
            final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
            //设置邮件会话参数
            Properties props = new Properties();
            //邮箱的发送服务器地址
            props.setProperty("mail.smtp.host", host);
            props.setProperty("mail.smtp.ssl.enable", "true");
            //邮箱发送服务器端口,这里设置为465端口
            props.setProperty("mail.smtp.port", "465");
            props.put("mail.smtp.auth", "true");
//            //UTF-8
//            props.setProperty("mail.smtp.allow8bitmime", "true");
////            props.setProperty("mail.smtps.allow8bitmime", "true");

            String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));

            //获取到邮箱会话,利用匿名内部类的方式,将发送者邮箱用户名和密码授权给jvm
            Session session = Session.getDefaultInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(from, password);
                }
            });
            //通过会话,得到一个邮件,用于发送
            Message msg = new MimeMessage(session);
            //设置发件人
            msg.setFrom(new InternetAddress(from));
//            //设置utf-8
//            msg.setHeader("Content-Type", "text/html; charset=UTF-8");
            //设置收件人,to为收件人,cc为抄送,bcc为密送
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toMail, false));
            //设置邮件消息
            msg.setSubject("CalculatorVerifyCode");
            msg.setText("Your verify code is:" + code);
            //设置发送的日期
//            msg.setSentDate(new Date());

            //调用Transport的send方法去发送邮件
            Transport.send(msg);
            return code;
        } catch (MessagingException mex) {
            mex.printStackTrace();
            return "error";
        }

    }
}