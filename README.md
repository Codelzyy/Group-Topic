# Tên đề tài: Xây dựng hệ thống CLoud mô phỏng trang dạy học số có thể tự scale up, scale down
## Thành viên nhóm:
```
Hồ Thái Long 20161332
Nguyễn Quốc Trung 20110588
Phan Công Tú 20110592
```

## Script tạo instance và deploy web
#!/bin/bash -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
# download nvm
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash
sudo yum install -y nodejs
sudo yum install -y git
#export NVM dir
#upgrade yum
sudo yum upgrade  -y
#install git
sudo yum install git -y
cd /home/ec2-user
git clone https://github.com/Codelzyy/Group-Topic.git
cd Group-Topic
#give permission
sudo chmod -R 755 .
#install node module
npm install
sudo npm install pm2 -g
# start the app
sudo pm2 start server.js
