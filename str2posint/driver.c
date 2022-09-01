#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

int main(void)
{
	char str[] = "01023g0";
	int n;

	n = str2posint(str);
	printf("%d\n", n);

	return (0);
}
