// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSlabs {
    enum SlabNames {
        slab0,
        slab1,
        slab2,
        slab3,
        slab4
    }
    
    mapping(SlabNames => uint256) public slabValues;
    mapping(address => SlabNames) public tokenCurrentSlab;

    constructor(uint256[] memory _slabValues) {
        require(_slabValues.length == 5, "TokenSlabs/constructor: Contract");
        for (uint256 i = 0; i < _slabValues.length; ) {
            slabValues[SlabNames(i)] = _slabValues[i];
            unchecked {
                ++i;
            }
        }
    }

    function _changeSlab(address _erc20token) private {
        uint256 currentBalance = IERC20(_erc20token).balanceOf(address(this));
        uint8 slab = 0;
        while (currentBalance > slabValues[SlabNames(slab)]) {
            tokenCurrentSlab[_erc20token] = SlabNames(slab + 1);
            unchecked {
                ++slab;
            }
        }
    }

    function deposit(address _erc20token, uint256 value) public {
        IERC20 ERC20Contract = IERC20(_erc20token);
        require(
            ERC20Contract.allowance(msg.sender, address(this)) > value,
            "TokenSlabs/deposit/[ERC20]allowance: Not enough allowance, approve before spending"
        );
        ERC20Contract.transferFrom(msg.sender, address(this), value);
        _changeSlab(_erc20token);
    }
}
