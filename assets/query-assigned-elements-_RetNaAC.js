/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=(t,r,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof r!="object"&&Object.defineProperty(t,r,e),e);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function f(t){return(r,e)=>{const{slot:n,selector:s}=t??{},u="slot"+(n?`[name=${n}]`:":not([name])");return i(r,e,{get(){var l;const o=(l=this.renderRoot)==null?void 0:l.querySelector(u),c=(o==null?void 0:o.assignedElements(t))??[];return s===void 0?c:c.filter(a=>a.matches(s))}})}}export{f as o};
