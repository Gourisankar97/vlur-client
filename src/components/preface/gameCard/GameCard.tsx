import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loading, showGame, showRoom } from '../../../store/Action/actions';
import './game-card.css'
import { Names } from '../../../utils/random-names'
import { serviceUrl } from '../../../env';
import axios from 'axios';

import io from 'socket.io-client';
const socket = io(serviceUrl, {
    upgrade: false, transports: ['websocket']
});
const GameCard =  () => {

    const icon1 = 'https://lh3.googleusercontent.com/EH8hGz-AW3zHcsBnvP5bsH81s2SbAkVlGuQqiAcP_jW9oH-rNmZkzKddvWOfF583bztEJ27Nl84bqnkAFk4ay4uuL0fDK9cjB1OkLHUQ35A1I_Xba6-YK8etfUVsJSdZeNU3a6IM3R5FdBOgVWZbUg_Ngn7voG2Di9WAdC-XWv2yJuzm2wat1OggNXaKjSCslSaMZpA797DeU-SoeBu3PRRn6JPpBVtBvQwfBbshYPUt-Z4wYAFNb1vWEfZEFfrywRRcUS1KaCzE06X_6q24hQ0rZUnFZVGMoCwGwLKOmLsnEhKNOVQxdTUcSHFqsgdNOvp-NvsK1LLgR0EpbTayEvW_DaJ3tfeIkkQy9GA0JQTtbZT_lB1ypELirdL1pYnh8oajcd90iEuFfqLAMUFE6msxpDN7-yexvE78QnKlJNlrnNkGP3m_mbvYJJ5QQqeH6XLqv3gyRokHbdz3zKXdgoFwRXg_qpPgOlM3kk_VZHtpoyVQd5ZFlV9_tOgrizeOKztrW751u6Z8QbB360kiUbi6qWnVYyO9w0wGtCoEnvUOj7pJIFapUgA84Us9Tr1__Ulgc-TAxm96JJgrzM8Ci08ZDvIMD5pdDn-G4jIweMZj4pLiTKYLp_Dmg68huVrK8ivewSnH0PcdRgBcAPs60-yfVbqaTywmVZ5ca0zGdbN3KxOLg2se6kzhjdWnsLB3X7tAH24cThtbp0MYfcGhaOzT=w557-h535-no?authuser=0';
    const icon2 = 'https://lh3.googleusercontent.com/-NGSFFepei6nld76xM8R6iqts0FrKj2ZIpDdmrkHLv96eMlWDgmsiv-wi3-wW-FtKPgX8QoRsxQbNWus8dFerHSxRbKSSffQOjrYYEJNgL9vC6vQbL25DqHLCTu4cpSCLr7e-SCi0xJq1jD5ZPvNQBYQZdYMmvXL6s1sWGbDU9-sBE6bP0Od-93kNzk4sNG8P1Ls8DvOmZt0Lx8VTMmfamnJ1iH_KarvzuLtU_ce8kgqdBwHNeejlqqUsdsIE1AEf8xR-mzYu0JPMsbMQQNs9rpPlKk10MM5AuElZpY5XgDvypdpxOOaHOjkqe-R5s6T84FidOJ3lhyWt4LwFHWpYsjocdW5b73jsoPY3feGlUruqKt0wMmnCf1Jq1DQqHanvfxs9y0aqo667oIPngyQDj5KK8q_Bbuu24OQsmgY37ttQpzv3UnfzmeUuGbBdEbzYOD5ww96Z3juRSioH7zVjMHDsHQg4JG9PAbmgXjBQs9gFK8Z6jwrUIi6D1XPjnpy0tTjO-nNfRgDzKhZqu0QuPVO2xP_bml3UVq2eWWeBDesgbiS4U9SsKRqK7yHwkhiQTSMQ1bqB7lKkuprCKAj-q4zkzg1wnW6ZC5eAvZlPpXpPSVPJJ9M1cUSWZGEDwojF8AiXhLJ8LlrPaIm41LWrr3PctyP9Op_nbaCEbmoP8DQxluJ3Xvf7AquVaLqtwKy4epqMQNnKsYfsjbM4b_Y_O1K=w724-h716-no?authuser=0';
    const icon3 = 'https://lh3.googleusercontent.com/StUEpnXKVzFJ7pusMkZA0Jb8pQh_SOhwtBUdNY9SsmkPWPeR0aiSZ_WwkaxxnMhfwzbkDWgPsPpsT3j1G8RBsN6TmmTIxMldU9102JQWHt-cddjh3-eX_YYKLYJfKcmcc81FONd_YeqqLqDm_Y813eTq-ZAK7bp0BKFt9t5QeXng1z4GVPf3vTFMONZS2eIedB1QUApuxnlsE4jvB4GgHl5-uulScX3sK61NjwTYc3-6r4U9BjM_mK5BYvrBUEFySZCdUbu1zQyqhWlYn-5usQ-Ih91rN5JCbp0a5MJBA_7Cwz5aUZAwr6-frCzGw36TS5TfUMVn7RlBkSTYdq2GBXfkw8hVb5tWRcehfFGRGwcB2jYcaFL3BAuKmoaVKBnMQkrljFl2QTq2yf8PHfpAaI5y73QgPLvOpIDIqrV1VoKjp-DMknarcvGMv8eoycmqopiO31LaLuZBQfnGC1oIYn_TmD_IS16xYXF5HBYRtDM9GV4-I_RoXOoRhB2iD4wn9baWjej1RtcBWktbeREDgdylSfrmgP-eJOrlD8vsdX6y4XMga4BrcdXG3Vszmkj6hSI3hxYCyHA_7KE8y_Qb7TQbv0twCKPGTEIQ7W5qJABi5h121FYmEFQP8OvbslI3SSInkMUph37FvThS7YVu89M9dXxiVo_26bWscbM9Y2xdYTHjixIic4VTgalWfpkuNeunVD9fgX3yFKZskAHNyN5y=w750-h716-no?authuser=0';
    const icon4 = 'https://lh3.googleusercontent.com/I8PpmDKPlv4YvhCeYvfhvr5B8eI849O0I72pIaeUVd542cP3i2TWvWkWf5Sgz7yUOngE9GxIEDbZv9_64dhsD2OIeMuSf2WCrLkjiwoCH9Wx0U79GU8-GvpITC2QVX_ZU4HKAYqzKWnaL3v6IBEzZ8raYjDU4gAzAkHjrRlkFys6Tz9rBZMheBNcIX7USzl_1KrRuu8M0bdyLXfKEsrGL1JeaZAOxcRfoa5nYAeqi62BmLR0vg0B5SeU9x7UU2D0vdJv4Mm8BapML10c5Eij1kLV4v2a-5qLW-5OieUeZmGPA9afsEeLp2LEHaQKrxQFL3zBDvUxapZtNJeQLVs3YwWmGWOtJsHlXtvAXW_siVP1ZX7mILnDjx5oAWkVWMyo1F4ZMj50DbfABwnA1UdK9G10RNYim7ad-4zdmD5wg-L5ivorEHJaFun88EAXPUaTKSNmh4s8eF9fMnc0wR_CiG5BowWtdg5c2r4WYG8-fjlOfz--CvQbnS6LEfzvIuBM7BeRJCRt5sVWobBLVJx3H9DRb3T9FOXVgGxx9gaC5nWP91mUwtOaEL5OVQTS_1H-IPe3dLxx6C_USSWwAY1OpFYev8ZLVi5LPCR19Cd-2BPWZOJeyY3bnfZds4cXY0vMcmEV9gD2jd-1iOhk0cLe2dWQmJRXOqJnGP8GKh_s_LEFHWIsVwHST8uq19c_aVdcEP9AlDdlWWMZ9OHbCE1nK4VW=w595-h560-no?authuser=0';

    const icon5 = 'https://lh3.googleusercontent.com/2hSC4oealvSL--fvqkX-TqCHxqkmcImBlcotw9EqRzmPXjDgrgToGKXE9OM4SrhY_zh2InHtCoUTJ54CSk8GAW1OiYYYzOOBcTBf-yCG0BTxunNUakrQPq0N2kD7mEOT0DG--kHchvSmfub_Sd6gL4usTrmVtw9xFa7id5Ruaj8jK7xpO2jK1B5m536TVrK2nRUOuDJYJJUM-tIbJpBUcLrYUHMIodw8RZp_jHvx0T0SMN-UYFCQ5wg7vYL8GBXK4eeco0LN-K50OVAC-OjrmFrKn3Q6s2VIn1FEenjhD45mWkYCv7SlSG7FAhs470okVPw983g7unF7UeYRZTbhf66nAe7qhKflVk4j0BIncJzNMLxjkOZsOfFrOV54WgQnlhEVxAGPuNno0n6eY4qGCr_OzNsoHX5F6uKYo6iC7wj7enXFriV83L6tlkpSmpBqQHNkP4TALPG-sSI6ssEqFmqmnCsbiY8Zt1hbIydjl6t7mznMSVA4Alwkd3uXQZfKHlyg78r3urmkW3kabY_MSQZwFXJK6c0cS7k6wRR8Vc8pA_DA8297ViFwi-SILuiKocaiNgZhb0GP2-Iy_BV4uYmk0mhOHpSRkTRfQJZ_WR3EVCuXxKRl_Iq4r0bgUtRgQ5mDohSLo_sbBn1sksjG5SIlEC1SP3QS1AUvvfqUvyzoXKrGIeVl8TWNhdC6eF1ou-fWYBuh5zC41ve9FXg-2fMz=w573-h536-no?authuser=0';
    const icon6 = 'https://lh3.googleusercontent.com/-u3TiMypHfvdbrqjut3znAcjuzbO_ay5a-Kdt_KalNlFjHclvgpUyiVEuWQAVd4USbMsuXO7e40mFP2DUyfYyuA1VzRJiLwRV1ypxBKx761MmgNqPxpFxBtRPD6NWW81qqlF47fXB_iQ6hsX-7Vc3qEkXZp2iUvL-_JPRhaFNHpl2GUPcnWHG-jvdJEBI7k46EBwl62N0uO0CjYUTs8I07qFJTXP9YwWMelItP8Q-7HEybG1BLZX9CEb4xhQKqeaKUK_uSObsp5aGwX6TA2LcWZpAkWDy0jNdtUDUd21c02_uesAwlEKQXcNX4etBsGbcq9Q9NzheOdrQlaPZQoopVYVnnMjZIBoJG4rv0miinSFGAlYJLLgo59ISI_yFWRkOdf1jHmdCoMIW-fL9eLivef7z1vwt5AwszfKWx4A3HxUEuw6ABlxiToQU-9kThwe0lLDaJTY_BhcnC8NXP7egy9Y2783G9PPsslVgnN9weHB65O_5ZOgxZOusz298wr0ear_6rqzJwzHAdBlzLgMv-t8T4aP8C-UgAnMlkrH1SLvCnFaRZrkJKlDjeXTq_caa7RaF-IjaC1U3VIp5B0RljSOG6yzLqUYAoMwQAosUioHKZz64g9ntdqM9wZ9lAWldP4URl3sxmppjj4BZPwydCjmta1aShM-gGyi2bflNgCYPOyJWkv_s8aKbArhCzrO595DICj5lloY_Jb7o-xML8mN=w194-h197-no?authuser=0';
    const icon7 = 'https://lh3.googleusercontent.com/Mo_Xj_easZdJQIspwFYZiux149Jlx47V_LobiG_ORZBUsVyMhEwFS7O6as2LOXjLA9NxjS-I0qnkLk_kt5ZDO9aNZwbduQYgzVfc2jm58zjiUDYaK1pJ0GI9_bli6DoT1C-UsinPnyW90UcGjjwEQ-w07_mVxV4gXhoYODF11XvTu_Xv2boPLoI6MoQtAep-VTxC1rjsB5MrO7p3BQlnQ4kxq-eubL7lXhM7rfD_9OPM6F69wXwQtz3TUE402rEMfg-ay-XW0Gnn0kN4uTqMG6pGpVbE_7D_yi-f1cuZ2Z2RkyyPgX2XCRkDTR5JALFYMMUGv7gyh7UuwINqfk-MvwrilFBqF5zwoCBFNcsG0y4siFJTKT59sO4jCphtJXgbrXKfrAqpkQVV1TwsMRrfMGdvEXRHdVzoXaorFW0UwyRJ726dV7JNPwPNAO7MEiMMiVd0dLz3GET8W075eNycdqE620EclBbwi-niKvsKqfO7gegk1w_jU5XTR0wvJOfXDFctGMUzjknQm_ZmaigU78agBp468bPX2Mj_YwmJmhVYhbC-eCvahD8nf5UCq5H7ZvK1aMzEn2ycSerDnQtskBJYbjVsE6My9Bb6W7YDUV5LvZmFoNAopTlxcJAeOq_YeBLOJf5WwcSZBs3kCsnZEUUShr5cWRQM98DOsUZI4pPnWIhXe9wy6Zh0vscBUhuziUS-u8T6mzVPZMVmJnBEuq6d=w566-h555-no?authuser=0';
    const icon8 = 'https://lh3.googleusercontent.com/3XFu0JRkBGjW2MiCDhOVq2-uVV8y_cV3KlHuj_7c1_LajK6mRvkMYfFrB786O0NLzsjn0ajbsRDbRs2pyrOPl_7Jyyzkw3uXvFm-hdZCOEidN3f-6in9p1bVOX8ecMPyfcRuGyhlJ60WZdEDS55c0P3KfdoO-3Lda52KMgCB-WjJ7R80zM9YISCJZ9GOLKp7Sjo-NFHrOJLz-VA2Czi-wzuhJCZ6TtKsZNaUrJZY1lKLICP9nWmELqjIP1O51AYtOPcBjSZbx_elzUfJIzJQ_YIV9cfNxtaccxzvzjh5QDBqd4c7_B3rWJg0xHpduMf2kC1MGnOgSUSSrSJFZAlul_NorvDHTUvI51Rpf4NyseIvHvVFBbwj_qYlr4i3HSPu1CyxjxN7WjWNlgZufLpS4PAPRlMGT6w95UrCd1qS6zyMoCKbxiLGnY8fOTawNV9EonruTbPI46HR3vAbHVkVFz-zhHCatgSAcxtV7xbA-QsI5Hj_w-QDZyE-njhBd6kcM75_ShyEF9QvYqpzBrDjgdJw26EhHNIlx9zsj6sclK1uE9UcOd51eGQEEMWvKOSwUGp6OHIguiB-fObrqJ01Q7w-1ZaKEVjQJci3wztSXJTrldsl18EoSDw-QHNQRGSyLMGwsau7RzCfVSiLnWDc4Q7iZlrqqWdVGhU2qp4UaxkYO3xUWM2r-GBBfNMokCO_33qyxiVPGDatM85f5VJgAQJj=w411-h396-no?authuser=0';

    const icon9 = 'https://lh3.googleusercontent.com/XZDDAvxJpjtJYcYDayBLHAgZlPJDMh-kc20df09-ETh9OKf2f0KREk4D0Pyw5RU71rrDiRWK1JvUCbOL4gAsuf_ZCAE0nmdCysrKlvkAO6VufHVPVfPnRJ-zJkXVv8_e2RNQPAOL-P1io_0kIdvWskC6V0Z7Sx89dPDVHycyrP0SO5T7UyvqPC68g7bL_RgoYJ-ltvQhpXYGAyxrHznxoJri-Iq8PGOH_s1IUtgCz97gRmmHrQJ9Gr6cXBenGDjzjlCNTndKYwTREm1ZJCWvjo_d-h0thu-XArnk3CWx5Ya-tIpBK1wsBetu1SC7H96DB4PefHNIZJOIqtlW_2gYwBNpcH6qwjlBE58Flap_Co66IH3drtFTIEjLmo1aAj3CtQlZVDMLHx0LAbJeczfXSW1ee3ILe_OCApGDSKVdq5lQKlGvGZvvy3zBsY6d0H4Wt6saygvVKMuPEiE2m8TAYbJNF2i5hBwBqz_rXDqGVpufok11FN7YNLp0ZSJJ1N5D2gBuO-XldYQbDwzh1p3-MK1BHH9mG2bMPuN7N6j5uDqMTncNJcV4_aZ_SX9OtEFp9eCoIBfohqZzD1c2IZM71DPLsjIskg0LNeGy1WUySaYftN_opuE26CQ11GBB6Wg8yCcaJTvsNxPm-ZYukfitRfEc8slOi4kjbXzR-dZqJFUnat8Njp5e5FF2Z-TF6K0dD-r-MNQW-kfuOU8TBU3y0v6O=w730-h695-no?authuser=0';
    const icon10 = 'https://lh3.googleusercontent.com/LlQ7muz1AovO_x0n3eMTlLQQbjQIsA-twHz3YOItS6LUZL2FADreJpw5jF02bt1ASD9WV6VPDD_3pCeE3wY7vlxNmvzYjnxrc-2O6E-2bxeWcN3iMBakg0gwEwMhgPujpZDJtScXy-3LXLcWaGbjW5TJUpfbZUSq8yu_kduCW9-wAVLhC4DxJfnN97lYLpNUlJiwm3FvJZtW5a66-rhgsYWIZD8JEQqf0rloVeJpcPPHkMzLPVPAgZDleKRBz963NxNPFoSW6V9PONS_5KdJBEPj9eVXPCrDzxGVRA_Vd5os-u_4U2PLUNRwaArNOnObtg8wUu2_GfETy88g5KpZxYZRp7cNAilaxQ6lAA1ooBQbSbfCqNCm87pBDIDhv0oCSVQu7oSQzWb_xL57hvI8fskhFPZhuLvMI0bW8sjBmH7vFqF4iAUaGtH565AFOg4ZGEZrN_gGgnA81oA96wBmvagmzWYJFEsjKKf14ZGNjymm2DBuw61cnXvOSujA9BTdUw3mSNGqBnQHiWzQujAiGil58-5CZW9wmB2n5u8rNgcd_29KQKpmUC2FHE6-50ALTNZhpZ8SfKPdNt75HuPAJbdXPgYw0DjPIuGbBKKUPOJkIsXwthMSbxap83OJt60ZJFeaUxYo8YCAmD2GPvzlqbSqMmXES5OPXW10Zih1WZYXTpw2dfLvPjHvCnMur01F5TuOt0xjUIAezVNiX_V6WoaN=w250-h245-no?authuser=0';
    const icon11 = 'https://lh3.googleusercontent.com/fHxgidleSjWFqVnfPaTqKW6JXTUp_2eQgZv2SAsEEeNXsYI5QuQg7ImBqvmv6bSTGZ28FWQkzvZxP2xpiLLbuVVSWtmAX03HCwgRN5rcV21SkOcVxL15lWIKHmw6sUBVI9FygP3v-9MScnH69PsglyMiUMf7l_5-wva0jm2If4iEBCu3QhbQwl2YMjw6BS9NdJi5HuavlL3W9ocar8mF7nBUnxearzHlIwd4yeHB01jKxy3oR48JuLs_XiUbhS-VvfCav-OfuuwQJcmp2pK_MDOYjcSmkEbVbJ7MLEVQeDQwrUC6nrs7IJRpDAZdhf6u7AyKfNAsExavPDC9j-Z2wOQgmMBB51MagyRzSHSk7WMNpZ1fuj7B8GqcHwaPePTFVJKf4PSmIvy3W4LvFOBtGE8qSIE5GA8DFcSWLpOEdX4ibX7vZixNgXcOOq6pVxD0Cl97F0AIR1xUiTmwmKtzBOJEmUnYWV9X_e2EZ8R1epDuGcX-Vj6vBwQiN1rq14AHZ5YPuvX2Y7V1tElDq4PR8DNkk3ITXct_pn3kfT4BQNnQpQ7GNstJu8TtepCr30nHqeXspLR4vv1eBRQHYFace2JiLCopunUWKhfox0B_FuMLnsKbSgfjpKYrdfB4lxmsRrg4NC4jRZ3HuV6h77i11xrD_okr7AC8P4AqZJ31aVwL1RAJNSIlDmAq0c6pMn2V56nZmwviiOawoa-ASYaYyVn4=w248-h238-no?authuser=0';
    const icon12 = 'https://lh3.googleusercontent.com/hKUVFJKYWTybpIBpIfCXvFgfSqMgcTdG9jPihwPVQL5USgRXCSMtTcwGx9L4_ixou8QxkkdkoRT3zUM8sfD6TCZYlsbB3SoJRXI5zzPdEmecTehuj3bKCjaVMd-tzrEhKX7ZocVMd0BHb2ELQoZZXTV3wqVzDttzDBK5adEGkwoVHMtETAhX2-SvDPgqZ-30HPcegGKIEDUcDK7hP3zj_VZxmxS3Q74zkKRCX_y008h1to6Y51mTHQsOmRvszueyQA1kQbNyg6UfDs26fcMpbCFlTzdGlIJdWD8JfpoLrjovrjsXtOFFxgmy0eRVAVqnbvW-cT4SBScmh-DsZPTXcRlpHqimJYPA2IyV2U4ofREZzQqqGASU0XG1fakXcYngl-l0hCXVZRoItE3mWijALQuzTGqnr4uvdbnQAvo0gdhu6HPnETO0n1yQYrT0Sz0go2yREgfCjbuIm9O_JX5m6kBLfe5NcLm8J2-QdcwQeA05BizloU0kViqzN-7LW_-CfLFXm4JdUOYQ1Io3hWvBAQOgTMs8b8mzJ6hRhqZLMZrai-9n1eqEx_uIvdJa4_a5SQztsMTcd6X-4YC-rM-70vtZa0qw0vXl8qSfTNlOxvhk1ptcv5RoSA4IcEOsscx0XC86135nXNuu3r5jMaJiIGNF7avyhpDIfnapl3tOuex_gcd3bkgmO65h_mWuiQSCOBuyG9TMa-RfxNT2BpgkD4z_=w366-h353-no?authuser=0';
    const icon13 = 'https://lh3.googleusercontent.com/B4tBck82HquJP26whHKuP3dp_q3uZXQO9GUS9a0z0gPZgn6E8RK6_bnXOieOZLocEG23DCoadU2HQ-orJ8VzE1yQlDipB9XW408mI_gmpIm2O_g4UoHveChw4MPlUVqWPHn7HiWJUzhbfRbCWxuwCesL55Jro6ocESXhqExW8W98BuiH0kvR124uf4Eb9qTQ7wfHAIttEGZfqdVjxV3Sy-wYwmxUi9FvGXF2-BY_-AB3Rue0FQ9wv2bVrnM8A5wmND7kK0hJPQwXdv1aFLUsQp2aVQEtxu8dWdf5YsWY654in9vbIhGK2qk8tmXFLJgXfvtrBzgfHHU2rmWo5Fk5gRHx52SEkcca7BzMVfrhPm8W2mYmgbmvMvdKUsSmo8bwxHqGsyefADeQUseDkaEpr5wZKEnEs7qaid-uhOAanvlrnInalPeheQEmAvNpHcsRpaxO1YFSW_Cheoa5w3iwkG-rz85YkXL7DKuURcdZ4-z_WNQrrknVJz2OE4_hJ59m5S9s4RnyrnasdbNFLA5bgTrBHZ5j9ItcU-J7FZ77kq9FMrJlXh4wZ1zqOfsnSoCq1bE8cYPueUYXx6PrDMTENLc495vvSzV8bPMWhMW75Oc3c9kkVo1EBDqeImKIOUtiffs9XQ5DGZfSGOdmcveuYChR0tlQxLP4jnHFr-2W4owRFCnsR529dNgcs3u9zDAAj8RFjxs9b-k-BcbizgtfUkbH=w167-h156-no?authuser=0';
    const icon14 = 'https://lh3.googleusercontent.com/cFsmEKVsJoYp_FcTIxUxaSodKBVLXLqNDBpa3Cv5B42SFLmB-ii7dGHH8HEaxGTCdeUQC5EisR5jsYB9_OlczrYoQK1tjHh4GXzrDfpSCJbj4KIFZhLoa-vwnhDCy56Zhyk5XSNaSg6j7iFMCDcJoIb0XxyQw_l6fmmm0fuDWBRdCWS-cDatv3Jk39KH_IN8LdTlJrebcxi1x398zYFXu-W6s-cdSjJ8ULtdp1Tv69_CB7AnYPE5-LfcjQLOVd6VGrCicskA1vM3LL2UleRX9kgQ0OcAOaQ7Acg5dxmbHdEl7_spSjwk4DSIjHPXUAjjRSZhmvo6jeWDM3haBdV3hofIxuuv7xficE8xUFxT_QAhFMIU7F_K78d8Jh5at7q4OIvn2-5iEHJ2-RWwHj3HEG_1wYQKQn8DLczm0J6VVU0TQviZRTKwIcECTgKM5ynSXzbZROS-UNyv_nIvS9fUbFURjL0eZZW7y8WIRPLOqG29MccNXw3imkocslxShqtJszfJtYfzTbKGeggyF9x9XdIYQAgm3H9NBSz43YEDG0g3E1a_0sqENevZg6uCfKoq1ZixDg9Zrgto8EzmYeN0Zjz36fbVEZg8G6mEUFQ2i1NqtkNpgFy7D477wCC_ED_NyGnQMaJlNUKZHwHmKYON3PS4opeet-7bacjBuUeZqE2t6VQuYnv7MtAYiZmLwUGRrRXbswgLNKkGhjkxalcZm__w=w1133-h1073-no?authuser=0';

    const wait = () => new Promise(res=>setTimeout(res,1500));
    const currentUrl = window.location.href.split("/");
    const dispatcher = useDispatch();


    console.log("location : "+currentUrl[currentUrl.length-1]);
    const ROOMID = currentUrl[currentUrl.length-1];

    const checkIfRoomIsThere = async (roomId: string) => {

        dispatcher({type:'roomId', payload:roomId});
        await wait();
    }

    if(ROOMID.charAt(0) === '?') {
        checkIfRoomIsThere(ROOMID.substring(1));
    }

    const [avatar, setAvatar] = useState(icon1);

    var [playerName, setPlayerName] = useState('');
    var [roomId, setRoomId] = useState('');
    var [user, setUser] = useState({
        playerId: '',
        name: '',
        score: 0,
        avatar:'',
        isAdmin:false
    });

    var [players, setPlayers] = useState([{
        playerId: '',
        name: '',
        score: 0,
        avatar:'',
        isAdmin:false
    }]);

    /*
     * Sound effects
     */
    



    const createRoom =  () => {
        try {

            axios.post(serviceUrl+'/room', { name: playerName, avatar: avatar})
                .then( async (res) => {  
                                roomId = res.data.roomId; 
                                setRoomId(roomId);
                                user = res.data.players[0]; 
                                setUser(user);
                                players = res.data.players;
                                setPlayers(players);

                                } )
                .catch((e)=>console.log(e));
        }
        catch (e) {}
    }
    const joinRoom = async () => {

        try {

            await axios.post(serviceUrl+'/room/'+ROOMID.substring(1), { name: playerName, avatar: avatar})
                    .then(async res => {

                                    user = res.data;
                                    console.log("res.data; : "+JSON.stringify(res.data));
                                    dispatcher({type:'SET_USER', name:res.data.name, playerId:res.data.playerId, score:res.data.score==null?0:user.score, avatar: res.data.avatar, isAdmin:res.data.isAdmin});
                                    // dispatcher(showRoom());
                                    setUser(user);
                                    await wait();
                                    })
                    .catch((e)=>console.log(e));

        }
        catch (e) {dispatcher({type:'PREFACE'});}
    }

    const joinRandom = async () => {

        try {

            await axios.post(serviceUrl+'/join-random', { name: playerName, avatar: avatar})
                    .then(async res => {
                        let data = res.data;
                        if(data.roomId) {
                            roomId = data.roomId; 
                            
                            setRoomId(roomId);
                            user = data.player;
                            dispatcher({type:'roomId', payload: roomId});
                            dispatcher({type:'SET_USER', name:data.player.name, playerId:data.player.playerId, score:0, avatar: data.player.avatar, isAdmin:data.player.isAdmin});
                            setUser(user);

                            await joinRandomEmit();
                        }
                        else {
                            dispatcher({type:'PREFACE'});
                        }
                    })
                    .catch(async (e)=> { 
                        console.log(e);
                        await dispatcher({type:'PREFACE'});
                        });
            }
            catch(e) {await dispatcher({type:'PREFACE'});}
    }



    const customSort = async (players: any) => {

        try {

            await players.sort((player1: any, player2: any)=>{
                if(player1.score > player2.score) {
                    return -1;
                }
                else if(player1.score < player2.score) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
    
            return players;

        }
        catch(e) {
            return players;
        }

    }


    


    
        /*
        * web-socket stuff
        */
        useEffect(()=> {
            socket.on('connect', function () {
              console.log("CONNECTED");
            });
          
            socket.on("message", function(data) {
              console.log("MESSAGE FROM WEBSOCKET : "+data.msg );
            });

            socket.on("join-room", async function(data) {


                if(data.gameStarted) {
                    let players = await customSort(data.players);
                    dispatcher({type: 'SET_GAME', game: data.game});
                    dispatcher({type:'SET_PLAYERS', players: players});
                    dispatcher({type:'SET_SKIP', skip: data.skipTime});
                    dispatcher({type: "SET_ROUND", currentRound: data.currentRound});
                    dispatcher(showGame());
                }
                else {
                    if(data.players) {
                        dispatcher({type:'SET_PLAYERS', players: data.players});
                    }
                }
                
              });

              socket.on("start-game", function(data) {
                if(data && data.game) dispatcher({type: 'SET_GAME', game: data.game});
                if(data && data.start) dispatcher(showGame());
            });

            socket.on("room-chat", async function(data) {
                if(data) { 
                    dispatcher({type:'ADD_MESSAGE', from: data.from, message: data.message, playerId: data.playerId});
                }
            });

            socket.on("score", async function(data) {
                if(data.players) {
                    let players = await customSort(data.players);
                    dispatcher({type:'SET_PLAYERS', players: players});
                } 
            });

            socket.on("join-random", async function(data) {

                if(data) {
                    let players = await customSort(data.players);
                    dispatcher({type: 'SET_GAME', game: data.game});
                    dispatcher({type:'SET_PLAYERS', players: players});
                    dispatcher({type: "SET_ROUND", currentRound: data.currentRound});
                    dispatcher({type:'SET_SKIP', skip: data.skipTime});
                    dispatcher(showGame());
                }
                else {
                    dispatcher({type: 'PREFACE'});
                }
            });

            socket.on("someone-disconnected", async function(data) {

                if(data.players) {
                    let players = await customSort(data.players);
                    dispatcher({type:'SET_PLAYERS', players: players});
                }
            });
          },[]);


        const acknowledge = async ()=> {

            if(ROOMID.charAt(0) === '?') {
                socket.emit('join', {roomId: ROOMID.substring(1), playerId: user.playerId});
            }
            else {
                socket.emit('join', {roomId: roomId, playerId: user.playerId});
            }
        };

        const joinRandomEmit = async () => {
            if(roomId && user) await socket.emit('join-random', {roomId: roomId, playerId: user.playerId});
        }


    return(
        <div className="main-div">
            <Grid>
                <GridItem span={3}></GridItem>
                <GridItem span={6} >
                    <div className="card">
                        <input  className={ "name-input" } placeholder="Type you name" name="name" autoComplete="off" 
                            onChange={ (text)=>{setPlayerName(text.target.value)} }></input>
                        <div className={ "avatar-div" }>
                            <Grid>
                                <GridItem span={6}>
                                    <div className="avatar">
                                        <img  className="avatar" src={avatar} alt="ss" />
                                    </div>
                                </GridItem>
                                <GridItem span={6}>
                                    <div className="dropdown">
                                        <button className="dropbtn">
                                            Avatar
                                        </button>
                                        
                                        <div className="dropdown-content">
                                            <div onClick={()=>setAvatar(icon1)}>
                                                <img src={icon1} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon2)}>
                                                <img src={icon2} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon3)}>
                                                <img src={icon3} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon4)}>
                                                <img src={icon4} width="20" height="15" alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon5)}>
                                                <img src={icon5} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon6)}>
                                                <img src={icon6} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon7)}>
                                                <img src={icon7} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon8)}>
                                                <img src={icon8} width="20" height="15" alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon9)}>
                                                <img src={icon9} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon10)}>
                                                <img src={icon10} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon11)}>
                                                <img src={icon11} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon12)}>
                                                <img src={icon12} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon13)}>
                                                <img src={icon13} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon14)}>
                                                <img src={icon14} width="20" height="15" alt={"icon"}/>
                                            </div>

                                        </div>
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                        <div className={ "btn-play" } onClick={ async ()=>{
                                            if(!playerName.trim()){
                                                playerName = Names[Math.floor(Math.random()*Names.length)];
                                                setPlayerName(playerName);
                                            }
                                            
                                            dispatcher(loading());
                                            await wait();
                                            if(ROOMID.charAt(0) === '?') {

                                                await joinRoom();
                                                await wait();
                                                                                              
                                                dispatcher({type:'SET_USER', name:playerName, playerId:user.playerId, score:user.score==null?0:user.score, avatar: avatar, isAdmin: user.isAdmin});
                                                await acknowledge();
                                                dispatcher(showRoom());
                                            }
                                            else {
                                                await joinRandom();
                                            }
                                            
                                            }}>{ ROOMID.charAt(0) === '?' ? "Enter room" :"Play random"} </div>
                        <div className={ "btn-room" } onClick={ async ()=>{ 
                                            if(!playerName.trim()) {
                                                playerName = Names[Math.floor(Math.random()*Names.length)];
                                                setPlayerName(playerName);
                                            }
                                            await createRoom();
                                            dispatcher(loading());
                                            await wait();
                                            console.log("ROOMID : "+roomId);
                                            dispatcher({type:'roomId', payload:roomId});
                                            dispatcher({type:'SET_USER', name:user.name, playerId:user.playerId, score:user.score==null?0:user.score, avatar: avatar, isAdmin: user.isAdmin});
                                            
                                            await acknowledge();

                                            dispatcher(showRoom());
                                            
                                            }}>Create room</div>

                    </div>
                </GridItem>
                <GridItem span={3}></GridItem>
            </Grid>
        </div>
    )
}

export default GameCard;