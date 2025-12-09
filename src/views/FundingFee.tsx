import React, { useEffect, useState } from 'react';

export default function HypeVaults() {

  // 初始化资产数据
  useEffect(() => {
  }, []);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 72px)', marginTop: '72px'}}>
      <iframe 
        src="https://loris.tools/embed?exchanges=aster%2Cbinance%2Cbingx%2Cbitget%2Cbluefin%2Cbybit%2Ccryptocom%2Cdrift%2Cedgex%2Cethereal%2Cextended%2Cgateio%2Chibachi%2Chuobi%2Chyperliquid%2Ckucoin%2Ckuma%2Clighter%2Cmexc%2Cokx%2Cpacifica%2Cparadex%2Cphemex%2Cvariational%2Cvest%2Cwoofipro&interval=apy&theme=dark&font=system&fontSize=14" 
        width="100%" 
        height="100%" 
        frameBorder={0} 
        style={{ border: '1px solid var(--widget-border-light)', borderRadius: 8 }}>
      </iframe>
    </div>
  );
}
