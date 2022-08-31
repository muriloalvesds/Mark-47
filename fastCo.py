from importlib.resources import path
import pyexcel as p
import os 
import win32com.client as win32
import json
from pathlib import Path
import win32com


gen_py_path = '/some/custom/location/gen_py'
Path(gen_py_path).mkdir(parents=True, exist_ok=True)
win32com.__gen_path__ = gen_py_path
url = "C:\\laragon\\www\\mark-45\\files\\"    
name = "statusinvest-busca-avancada"
#excel = win32.gencache.EnsureDispatch('Excel.Application')
excel = win32.Dispatch('Excel.Application')
wb = excel.Workbooks.Open(url+name+".csv")

wb.SaveAs(url+name+"xlsx", FileFormat = 51)    #FileFormat = 51 is for .xlsx extension
wb.Close()                               #FileFormat = 56 is for .xls extension
excel.Application.Quit()

