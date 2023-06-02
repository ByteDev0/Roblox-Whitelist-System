-- No checks 😪

local SK = getgenv().script_key
local domain, http_request = "url", http_request or request or (syn and syn.request)
if not SK or SK == '' or #SK < 8 then print('Invalid script key!') return end

local function http_get(a) return http_request({ Method = 'GET', Url = a }) end
local function mathfloor(n) return n - n % 1 end
local function fail_message(args) 
    local s = args.str and ('[Whitelist] ' .. args.str .. ' (Error code: ' .. args.code .. ')\n') or '[Whitelist] Something went wrong... (Error code: ' .. args.code .. ')\n'
    (rconsoleprint or print)(s) 
end

local WL_API, rnd_seed = {
    ENCRYPTION_KEY = "g91O5cEpJzbpDkfh0nS2DdJu1HYz0YnPa2EpDJLjKkMFFQWywjEQftyKGFLBxXXy",
    RANDOM = (function(min, max)
        local a, c, m = 1103515245, 12345, 2^31
        rnd_seed = (a * rnd_seed + c) % m
        return (rnd_seed % (max - min + 1)) + min
    end),
    EQUATE = (function(x)
        x = x + 54
        return string.format('%.0f', ((x ^ 2) + (4 * x) + 27272 + ((((x % 2) ^ 2) + ((x % 11) ^ 2)) * x)))
    end),
    ENCRYPT = (function(str, key) 
        local result, str, key = "", tostring(str), tostring(WL_API.ENCRYPTION_KEY)
        for i = 1, #str do
            local letter, keyLetter = str:sub(i, i), key:sub(((i - 1) % #key) + 1, ((i - 1) % #key) + 1)
            result = result .. string.format("%03d", string.byte(letter) + string.byte(keyLetter))
        end
        return result
    end),
    DECRYPT = (function(str, key)
        local result, str, key = "", tostring(str), tostring(WL_API.ENCRYPTION_KEY)
        for i = 1, #str, 3 do
            local number, keyLetter = tonumber(str:sub(i, i+2)), key:sub(((i - 1) / 3 % #key) + 1, ((i - 1) / 3 % #key) + 1)
            result = result .. string.char(number - string.byte(keyLetter))
        end
        return result
    end),
    GENERATE_LINK = (function(args)
        return domain .. args.route .. '?a=' .. WL_API.ENCRYPT(tostring(args.equation)) .. '&b=' .. WL_API.ENCRYPT(args.token) .. '&c=' .. WL_API.ENCRYPT(SK) .. '&d=' .. WL_API.ENCRYPT(tostring(args.random))
    end),
    GENERATE_CRACK_LINK = (function(args)
        return domain .. 'userauth' .. '?a=' .. WL_API.ENCRYPT(args.reason) .. '&b=' .. WL_API.ENCRYPT(SK) .. '&c=' .. WL_API.ENCRYPT(args.equation) .. '&d=' .. WL_API.ENCRYPT(args.random)
    end),
    GENERATE_TOKEN = (function()
        local main, one, two, three = 0, 0, 0, 0
        for i = 1, 5 do
            main, one, two, three = main + WL_API.RANDOM(1111, 9999), one + WL_API.RANDOM(1111, 9999), two + WL_API.RANDOM(1111, 9999), three + WL_API.RANDOM(1111, 9999)
        end
        return tostring((((main % 7) + 2) + ((one % 2) + 6) + (three % 2) + (two % 1)) % 40) + main)
    end)
}, #game:GetService('Workspace'):GetChildren()

local function update_seed()
    for i, v in pairs(game:GetService('Players'):GetChildren()) do
        rnd_seed = (rnd_seed + #v.Name + v.UserId + v.UserId) % 10000000
        pcall(function()
            rnd_seed = (rnd_seed + mathfloor((v.Head.Position.X * 1000) % 10000 + 2) * mathfloor((v.Head.Position.Y * 1000 + 2) % 100000)) % 10000000
        end)
    end
end
update_seed()

if WL_API.DECRYPT(WL_API.ENCRYPT('sexxx')) ~= 'sexxx' then fail_message({ code = '0x01' }); return end

function CRACK_ATTEMPT(reason)
    pcall(function()
        update_seed(); rnd_seed = rnd_seed + #reason
        local rand_num = WL_API.RANDOM(11111, 99999) + #SK
        local resp = http_get(WL_API.GENERATE_CRACK_LINK({ reason = reason, equation = WL_API.EQUATE(rand_num), random = rand_num }))
        rconsoleclear(); wait(2); while true do end
    end)
end

local http_service = game:GetService('HttpService')

update_seed()

local random_number, equated_number, generated_token = WL_API.RANDOM(1111, 9999), WL_API.EQUATE(WL_API.RANDOM(1111, 9999)), WL_API.GENERATE_TOKEN()

local auth_link = WL_API.GENERATE_LINK({ route = 'authenticate', token = generated_token, equation = equated_number, random = random_number })
if not auth_link then fail_message({ code = '0x03' }); return end

local messages = {['IVD_API'] = "Invalid API Key!",["API_KEY_NF"] = "User is not whitelisted!",["NOT_WLED"] = "User is not whitelisted!",["UNSUPP_EXEC"] = "Unsupported executor!",["HWID_MISMATCH"] = "HWID mismatch!",["SMTH_WENT_WRONG"] = "Something went wrong! Try contacting the script's staff.",["SERVER_EQUATION"] = "There is a possibility that your executor is not supported. Try contacting the script's staff.",["USER_BLACKLISTED"] = "You are blacklisted from using this script. Try contacting the script's staff.",["BAN_EXPIRED"] = "Your ban has expired! You may now rejoin the game and execute again. Please note that any more violations will result in extended ban times."}

local REQUEST, DECRYPTED, DATA = http_get(auth_link), WL_API.DECRYPT(http_get(auth_link).Body), http_service:JSONDecode(WL_API.DECRYPT(http_get(auth_link).Body))

if DATA['message'] ~= 'USER_AUTHORIZED' or DATA['verification'] == nil or not DATA['success'] or DATA['token'] ~= generated_token or tonumber(DATA['server_equation']) ~= tonumber(DATA['equation']) or tonumber(DATA['server_equation']) ~= tonumber(equated_number) or tonumber(DATA['equation']) ~= tonumber(equated_number) then CRACK_ATTEMPT('EqHookingType1'); fail_message({ code = '0x08' }); wait(2); while true do end; return; end

local verification = WL_API.ENCRYPT((SK .. '||' .. generated_token .. '||' .. SK .. generated_token .. '|' .. random_number .. '|' .. equated_number .. random_number))
if not verification or DATA['verification'] ~= verification then CRACK_ATTEMPT('EqHookingType1'); fail_message({ code = '0x12' }); wait(2); while true do end; return; end

repeat wait() until verification and verification == DATA['verification']

return setmetatable({ [verification] = function(...) end }, { __index = function(s, idx) if idx ~= verification then CRACK_ATTEMPT('EqHookingType2') return end end })[DATA['verification']](...) 
