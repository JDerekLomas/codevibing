"""
Catalogue data source modules.
"""
from .base import CatalogueRecord, CatalogueBase
from .ustc import USTC
from .vd16 import VD16
from .vd17 import VD17
from .vd18 import VD18
from .estc import ESTC

__all__ = [
    "CatalogueRecord",
    "CatalogueBase",
    "USTC",
    "VD16",
    "VD17",
    "VD18",
    "ESTC",
]


