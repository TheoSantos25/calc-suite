export interface CLICommand {
  id: string
  name: string
  category: string
  description: string
  powershell: string
  cmd: string
  linux: string
}

export const cliCategories = [
  { id: 'all', label: 'All' },
  { id: 'networking', label: 'Networking' },
  { id: 'file-ops', label: 'File Operations' },
  { id: 'user-mgmt', label: 'User Management' },
  { id: 'services', label: 'Services' },
  { id: 'system-info', label: 'System Info' },
]

export const cliCommands: CLICommand[] = [
  // Networking
  { id: 'ping', name: 'Ping', category: 'networking', description: 'Test connectivity to a host', powershell: 'Test-Connection <host>', cmd: 'ping <host>', linux: 'ping <host>' },
  { id: 'ipconfig', name: 'IP Configuration', category: 'networking', description: 'Show network adapter settings', powershell: 'Get-NetIPAddress', cmd: 'ipconfig /all', linux: 'ip addr show' },
  { id: 'dns-lookup', name: 'DNS Lookup', category: 'networking', description: 'Resolve a hostname', powershell: 'Resolve-DnsName <host>', cmd: 'nslookup <host>', linux: 'dig <host>' },
  { id: 'traceroute', name: 'Traceroute', category: 'networking', description: 'Trace the route to a host', powershell: 'Test-NetConnection <host> -TraceRoute', cmd: 'tracert <host>', linux: 'traceroute <host>' },
  { id: 'netstat', name: 'Active Connections', category: 'networking', description: 'Show active network connections', powershell: 'Get-NetTCPConnection', cmd: 'netstat -an', linux: 'ss -tuln' },
  { id: 'flush-dns', name: 'Flush DNS', category: 'networking', description: 'Clear the DNS resolver cache', powershell: 'Clear-DnsClientCache', cmd: 'ipconfig /flushdns', linux: 'sudo systemd-resolve --flush-caches' },
  { id: 'port-check', name: 'Check Port', category: 'networking', description: 'Test if a specific port is open', powershell: 'Test-NetConnection <host> -Port <port>', cmd: 'telnet <host> <port>', linux: 'nc -zv <host> <port>' },
  { id: 'arp-table', name: 'ARP Table', category: 'networking', description: 'Show the ARP cache', powershell: 'Get-NetNeighbor', cmd: 'arp -a', linux: 'arp -a' },

  // File Operations
  { id: 'list-files', name: 'List Files', category: 'file-ops', description: 'List directory contents', powershell: 'Get-ChildItem', cmd: 'dir', linux: 'ls -la' },
  { id: 'copy-file', name: 'Copy File', category: 'file-ops', description: 'Copy a file or directory', powershell: 'Copy-Item <src> <dst>', cmd: 'copy <src> <dst>', linux: 'cp <src> <dst>' },
  { id: 'move-file', name: 'Move / Rename', category: 'file-ops', description: 'Move or rename a file', powershell: 'Move-Item <src> <dst>', cmd: 'move <src> <dst>', linux: 'mv <src> <dst>' },
  { id: 'delete-file', name: 'Delete File', category: 'file-ops', description: 'Delete a file', powershell: 'Remove-Item <path>', cmd: 'del <path>', linux: 'rm <path>' },
  { id: 'find-file', name: 'Find File', category: 'file-ops', description: 'Search for files by name', powershell: 'Get-ChildItem -Recurse -Filter <pattern>', cmd: 'dir /s /b <pattern>', linux: 'find / -name <pattern>' },
  { id: 'file-perms', name: 'File Permissions', category: 'file-ops', description: 'View or change file permissions', powershell: 'Get-Acl <path>', cmd: 'icacls <path>', linux: 'chmod / ls -la' },
  { id: 'disk-usage', name: 'Disk Usage', category: 'file-ops', description: 'Check available disk space', powershell: 'Get-PSDrive -PSProvider FileSystem', cmd: 'wmic logicaldisk get size,freespace', linux: 'df -h' },
  { id: 'create-dir', name: 'Create Directory', category: 'file-ops', description: 'Create a new directory', powershell: 'New-Item -ItemType Directory <path>', cmd: 'mkdir <path>', linux: 'mkdir -p <path>' },

  // User Management
  { id: 'list-users', name: 'List Users', category: 'user-mgmt', description: 'List local user accounts', powershell: 'Get-LocalUser', cmd: 'net user', linux: 'cat /etc/passwd' },
  { id: 'current-user', name: 'Current User', category: 'user-mgmt', description: 'Show the current logged-in user', powershell: '$env:USERNAME', cmd: 'whoami', linux: 'whoami' },
  { id: 'add-user', name: 'Add User', category: 'user-mgmt', description: 'Create a new local user', powershell: 'New-LocalUser -Name <name>', cmd: 'net user <name> /add', linux: 'sudo useradd <name>' },
  { id: 'reset-password', name: 'Reset Password', category: 'user-mgmt', description: 'Reset a user password', powershell: 'Set-LocalUser -Name <user> -Password (ConvertTo-SecureString "pass" -AsPlain -Force)', cmd: 'net user <user> <newpass>', linux: 'sudo passwd <user>' },
  { id: 'list-groups', name: 'List Groups', category: 'user-mgmt', description: 'List local groups', powershell: 'Get-LocalGroup', cmd: 'net localgroup', linux: 'cat /etc/group' },
  { id: 'add-to-group', name: 'Add to Group', category: 'user-mgmt', description: 'Add a user to a group', powershell: 'Add-LocalGroupMember -Group <grp> -Member <user>', cmd: 'net localgroup <grp> <user> /add', linux: 'sudo usermod -aG <grp> <user>' },

  // Services
  { id: 'list-services', name: 'List Services', category: 'services', description: 'List all services', powershell: 'Get-Service', cmd: 'sc query type= service', linux: 'systemctl list-units --type=service' },
  { id: 'start-service', name: 'Start Service', category: 'services', description: 'Start a service', powershell: 'Start-Service -Name <name>', cmd: 'sc start <name>', linux: 'sudo systemctl start <name>' },
  { id: 'stop-service', name: 'Stop Service', category: 'services', description: 'Stop a service', powershell: 'Stop-Service -Name <name>', cmd: 'sc stop <name>', linux: 'sudo systemctl stop <name>' },
  { id: 'restart-service', name: 'Restart Service', category: 'services', description: 'Restart a service', powershell: 'Restart-Service -Name <name>', cmd: 'sc stop <name> && sc start <name>', linux: 'sudo systemctl restart <name>' },
  { id: 'service-status', name: 'Service Status', category: 'services', description: 'Check the status of a service', powershell: 'Get-Service -Name <name>', cmd: 'sc query <name>', linux: 'systemctl status <name>' },
  { id: 'scheduled-tasks', name: 'Scheduled Tasks', category: 'services', description: 'List scheduled tasks or cron jobs', powershell: 'Get-ScheduledTask', cmd: 'schtasks /query', linux: 'crontab -l' },

  // System Info
  { id: 'system-info', name: 'System Info', category: 'system-info', description: 'Show detailed system information', powershell: 'Get-ComputerInfo', cmd: 'systeminfo', linux: 'uname -a && lsb_release -a' },
  { id: 'uptime', name: 'Uptime', category: 'system-info', description: 'Show how long the system has been running', powershell: '(Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime', cmd: 'systeminfo | find "Boot Time"', linux: 'uptime' },
  { id: 'processes', name: 'Running Processes', category: 'system-info', description: 'List all running processes', powershell: 'Get-Process', cmd: 'tasklist', linux: 'ps aux' },
  { id: 'kill-process', name: 'Kill Process', category: 'system-info', description: 'Terminate a running process', powershell: 'Stop-Process -Name <name> -Force', cmd: 'taskkill /IM <name> /F', linux: 'kill -9 <pid>' },
  { id: 'env-vars', name: 'Environment Variables', category: 'system-info', description: 'Show environment variables', powershell: 'Get-ChildItem Env:', cmd: 'set', linux: 'env' },
  { id: 'installed-software', name: 'Installed Software', category: 'system-info', description: 'List installed programs', powershell: 'Get-Package', cmd: 'wmic product get name', linux: 'dpkg --list' },
]
